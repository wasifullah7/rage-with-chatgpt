const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

class PdfService {
    // Validate file
    validateFile(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            throw new Error('File is empty');
        }

        const fileExtension = path.extname(filePath).toLowerCase();
        if (fileExtension !== '.pdf' && fileExtension !== '.txt') {
            throw new Error('File must be either PDF or TXT');
        }
    }

    // Extract text from file
    async extractText(filePath) {
        try {
            // Validate file first
            this.validateFile(filePath);

            console.log(`Reading file from: ${filePath}`);
            const fileExtension = path.extname(filePath).toLowerCase();
            
            if (fileExtension === '.txt') {
                // For text files, read directly
                const text = fs.readFileSync(filePath, 'utf8');
                console.log(`Successfully read ${text.length} characters from text file`);
                return text;
            } else {
                // For PDF files, use pdf-parse
                const dataBuffer = fs.readFileSync(filePath);
                console.log('Parsing PDF content...');
                const data = await pdf(dataBuffer, {
                    max: 0, // No page limit
                    version: 'v2.0.550'
                });

                if (!data || !data.text) {
                    throw new Error('No text content found in PDF');
                }

                console.log(`Successfully extracted ${data.text.length} characters from PDF`);
                return data.text;
            }
        } catch (error) {
            console.error('Error extracting text:', error);
            if (error.message.includes('Invalid PDF structure')) {
                throw new Error('The PDF file appears to be corrupted or has an invalid structure. Please ensure the file is a valid PDF.');
            }
            throw new Error(`Failed to extract text: ${error.message}`);
        }
    }

    // Chunk text into sections
    chunkText(text, options = {}) {
        const {
            chunkSize = 1000,
            chunkOverlap = 200,
            separator = '\n'
        } = options;

        // Split text into sentences or paragraphs
        const segments = text.split(separator).filter(segment => segment.trim().length > 0);
        const chunks = [];
        let currentChunk = '';
        let currentLength = 0;

        for (const segment of segments) {
            // If adding this segment would exceed chunk size, save current chunk and start new one
            if (currentLength + segment.length > chunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                // Start new chunk with overlap
                const overlapText = currentChunk.split(separator).slice(-3).join(separator);
                currentChunk = overlapText + separator + segment;
                currentLength = currentChunk.length;
            } else {
                currentChunk += (currentChunk.length > 0 ? separator : '') + segment;
                currentLength = currentChunk.length;
            }
        }

        // Add the last chunk if it's not empty
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    // Process PDF and return chunks
    async processPdf(filePath, options = {}) {
        try {
            const text = await this.extractText(filePath);
            const chunks = this.chunkText(text, options);
            return {
                text,
                chunks,
                metadata: {
                    totalChunks: chunks.length,
                    averageChunkSize: chunks.reduce((acc, chunk) => acc + chunk.length, 0) / chunks.length
                }
            };
        } catch (error) {
            console.error('Error processing PDF:', error);
            throw error;
        }
    }
}

module.exports = new PdfService(); 