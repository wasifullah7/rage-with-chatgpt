import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [useRag, setUseRag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExamples, setShowExamples] = useState(false);

  const exampleQuestions = {
    education: [
      "What is Wasif's GPA and when did he graduate?",
      "What were Wasif's academic achievements?",
      "What relevant coursework did Wasif complete?"
    ],
    skills: [
      "What are Wasif's frontend development skills?",
      "What database technologies does Wasif know?",
      "What DevOps tools is Wasif familiar with?"
    ],
    projects: [
      "What features did Wasif implement in the e-commerce platform?",
      "What technologies were used in the chat application?",
      "What was the accuracy of the ML image classification project?"
    ],
    career: [
      "What are Wasif's short-term career goals?",
      "What does Wasif want to achieve in 3-5 years?",
      "What are Wasif's aspirations in AI?"
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, useRag }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (question) => {
    setMessage(question);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Assistant</h1>
        <div className="mode-toggle">
          <label>
            <input
              type="checkbox"
              checked={useRag}
              onChange={(e) => setUseRag(e.target.checked)}
            />
            <span className="toggle-label">RAG Mode</span>
          </label>
        </div>
      </header>

      <main className="App-main">
        <div className="instructions">
          <h2>How to Use</h2>
          <p>
            {useRag 
              ? "RAG Mode is ON: The AI will search through Wasif's professional profile to provide detailed answers."
              : "RAG Mode is OFF: The AI will provide general responses without specific context."}
          </p>
          <button 
            className="examples-toggle"
            onClick={() => setShowExamples(!showExamples)}
          >
            {showExamples ? "Hide Example Questions" : "Show Example Questions"}
          </button>
        </div>

        {showExamples && (
          <div className="examples-container">
            <div className="example-section">
              <h3>Education Questions</h3>
              {exampleQuestions.education.map((q, i) => (
                <button
                  key={`edu-${i}`}
                  className="example-question"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="example-section">
              <h3>Skills Questions</h3>
              {exampleQuestions.skills.map((q, i) => (
                <button
                  key={`skills-${i}`}
                  className="example-question"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="example-section">
              <h3>Project Questions</h3>
              {exampleQuestions.projects.map((q, i) => (
                <button
                  key={`projects-${i}`}
                  className="example-question"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="example-section">
              <h3>Career Questions</h3>
              {exampleQuestions.career.map((q, i) => (
                <button
                  key={`career-${i}`}
                  className="example-question"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="query-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question here..."
            rows="4"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Send'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="response-container">
            <h3>Response</h3>
            <div className="response-content">
              <p>{response.response}</p>
              {response.metadata && (
                <div className="response-metadata">
                  <h4>Additional Information:</h4>
                  <ul>
                    {response.metadata.chunks && (
                      <li>Relevant sections found: {response.metadata.chunks.length}</li>
                    )}
                    {response.metadata.processingTime && (
                      <li>Processing time: {response.metadata.processingTime}ms</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 