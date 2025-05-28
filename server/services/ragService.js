const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Process document into chunks
async function processDocument(text) {
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Create chunks of 1000 characters with 200 character overlap
  const chunks = [];
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > 1000) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        // If a single paragraph is longer than 1000 characters, split it
        const words = paragraph.split(' ');
        currentChunk = '';
        for (const word of words) {
          if (currentChunk.length + word.length + 1 > 1000) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk += (currentChunk.length > 0 ? ' ' : '') + word;
          }
        }
      }
    } else {
      currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Get embeddings for text
async function getEmbedding(text) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Search for similar chunks
async function searchSimilarChunks(query, chunks) {
  try {
    // Get embedding for the query
    const queryEmbedding = await getEmbedding(query);
    
    // Get embeddings for all chunks
    const chunkEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await getEmbedding(chunk);
        return { text: chunk, embedding };
      })
    );
    
    // Calculate similarities
    const similarities = chunkEmbeddings.map(({ text, embedding }) => ({
      text,
      similarity: cosineSimilarity(queryEmbedding, embedding)
    }));
    
    // Sort by similarity and return top 3 most relevant chunks
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  } catch (error) {
    console.error('Error searching similar chunks:', error);
    throw error;
  }
}

module.exports = {
  processDocument,
  searchSimilarChunks
}; 