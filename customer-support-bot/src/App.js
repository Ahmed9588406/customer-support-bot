import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [useRag, setUseRag] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Array to store chat history
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    // Add the user's question to the chat history
    const newMessage = { type: "user", text: question };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setQuestion(''); // Clear the input field

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/ask/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, use_rag: useRag }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add the bot's response to the chat history
      const botMessage = { type: "bot", text: data.answer };
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { type: "bot", text: "Sorry, something went wrong. Please try again later." };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Customer Support Bot</h1>

      {/* Chat History */}
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '5px',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: message.type === "user" ? '#007BFF' : '#e9ecef',
              color: message.type === "user" ? '#fff' : '#000',
              alignSelf: message.type === "user" ? 'flex-end' : 'flex-start',
            }}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Question Input */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here..."
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>

        {/* RAG Checkbox */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={useRag}
              onChange={(e) => setUseRag(e.target.checked)}
            />
            Use RAG for context
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </form>
    </div>
  );
}

export default App;