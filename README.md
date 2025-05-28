# RAG-Enabled ChatGPT Application

A web application that combines ChatGPT with Retrieval-Augmented Generation (RAG) to provide context-aware responses based on a knowledge base.

## Features

- 🤖 ChatGPT integration for general queries
- 📚 RAG implementation for context-aware responses
- 🔍 Semantic search using embeddings
- 💻 Modern React frontend
- 🚀 Express.js backend
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/wasifullah7/rage-with-chatgpt.git
cd rag-chatgpt
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create environment files:

In the server directory, create a `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

4. Start the development servers:

```bash
# Start the backend server (from server directory)
npm run dev

# Start the frontend development server (from client directory)
npm start
```

## Usage

1. Open the application in your browser (default: http://localhost:3000)
2. Toggle RAG mode on/off using the switch in the header
3. Type your question or use one of the example questions
4. View the response with relevant context (when RAG mode is enabled)

## Project Structure

```
rag-chatgpt/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── App.css
├── server/                 # Express backend
│   ├── services/
│   │   └── ragService.js   # RAG implementation
│   ├── data/
│   │   └── sample.txt      # Sample knowledge base
│   └── index.js           # Main server file
└── README.md
```

## API Endpoints

### POST /api/query
Main endpoint for both ChatGPT and RAG queries.

Request body:
```json
{
  "message": "Your question here",
  "useRag": true/false
}
```

Response:
```json
{
  "response": "AI response text",
  "metadata": {
    "chunks": [...],
    "processingTime": 123
  }
}
```

## Deployment

The application can be deployed to various platforms:

### Frontend
- Vercel
- Netlify
- GitHub Pages

### Backend
- Heroku
- DigitalOcean
- AWS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the ChatGPT API
- React team for the amazing frontend framework
- Express.js team for the backend framework 
