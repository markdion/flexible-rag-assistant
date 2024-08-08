import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/chatApi';
import { AxiosResponse } from 'axios';

interface ChatMessage {
  type: string;
  content: string;
}

function Chat(): JSX.Element {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Send chat message to backend
    axiosInstance.post('/chat', { prompt })
      .then((response: AxiosResponse<ChatMessage>) => {
        setChatHistory([...chatHistory, response.data]);
        setPrompt('');
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {chatHistory.map((message, index) => (
          <div key={index}>
            <strong>{message.type}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt:</label>
        <input type="text" id="prompt" name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <br />
        <br />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default Chat;