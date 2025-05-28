require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const { processDocument, searchSimilarChunks } = require('./services/ragService');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Unified API endpoint for both ChatGPT and RAG
app.post('/api/query', async (req, res) => {
  try {
    const { message, useRag } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Generating response...');
    let response;
    let metadata = {};

    if (useRag) {
      console.log('Processing document for RAG...');
      try {
        // Process the document and get relevant chunks
        const filePath = path.join(__dirname, 'data', 'sample.txt');
        console.log('Reading file from:', filePath);
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        console.log(`Successfully read ${fileContent.length} characters from text file`);
        
        const chunks = await processDocument(fileContent);
        const relevantChunks = await searchSimilarChunks(message, chunks);
        
        // Create context from relevant chunks
        const context = relevantChunks.map(chunk => chunk.text).join('\n\n');
        
        // Generate response using ChatGPT with context
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant. Use the provided context to answer questions accurately. If the context doesn't contain relevant information, say so."
            },
            {
              role: "user",
              content: `Context: ${context}\n\nQuestion: ${message}`
            }
          ],
        });

        response = completion.data.choices[0].message.content;
        metadata = {
          chunks: relevantChunks,
          processingTime: Date.now() - req.startTime
        };
      } catch (error) {
        console.error('Error in RAG processing:', error);
        return res.status(500).json({ error: 'Error processing document for RAG' });
      }
    } else {
      // Regular ChatGPT response
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      response = completion.data.choices[0].message.content;
    }

    // Send response with metadata
    res.json({
      response: response,
      metadata: metadata
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 