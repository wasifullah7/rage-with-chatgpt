const { OpenAI } = require('openai');

class EmbeddingService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = 'text-embedding-ada-002';
    }

    // Generate embedding for a single text
    async generateEmbedding(text) {
        try {
            const response = await this.openai.embeddings.create({
                model: this.model,
                input: text
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw new Error('Failed to generate embedding');
        }
    }

    // Generate embeddings for multiple texts
    async generateEmbeddings(texts) {
        try {
            const embeddings = await Promise.all(
                texts.map(text => this.generateEmbedding(text))
            );
            return embeddings;
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw error;
        }
    }

    // Calculate cosine similarity between two vectors
    calculateCosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
        const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
        const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
        return dotProduct / (normA * normB);
    }

    // Find most similar chunks for a query
    async findSimilarChunks(query, chunks, topK = 3) {
        try {
            // Generate embedding for the query
            const queryEmbedding = await this.generateEmbedding(query);
            
            // Generate embeddings for all chunks
            const chunkEmbeddings = await this.generateEmbeddings(chunks);
            
            // Calculate similarities and sort
            const similarities = chunks.map((chunk, index) => ({
                chunk,
                similarity: this.calculateCosineSimilarity(queryEmbedding, chunkEmbeddings[index])
            }));
            
            // Sort by similarity and get top K results
            similarities.sort((a, b) => b.similarity - a.similarity);
            return similarities.slice(0, topK);
        } catch (error) {
            console.error('Error finding similar chunks:', error);
            throw error;
        }
    }
}

module.exports = new EmbeddingService(); 