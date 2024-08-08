import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/chatApi';
import { AxiosResponse } from 'axios';

interface ChatMessage {
  type: 'Human' | 'AI';
  content: string;
}

function Chat(): JSX.Element {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Send chat message to backend
    axiosInstance.post('/chat', { prompt })
      .then((response: AxiosResponse<string>) => {
        const newPrompt: ChatMessage = {
          type: 'Human',
          content: prompt,
        };
        const newResponse: ChatMessage = {
          type: 'AI',
          content: response.data,
        };
        setChatHistory([...chatHistory, newPrompt, newResponse]);
        setPrompt('');
      })
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {chatHistory.map((message, index) => (
          <div key={index} className={message.type}>
            <strong>{message.type}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
      {loading && <div className="spinner">Loading...</div>}
    </div>
  );
}

export default Chat;