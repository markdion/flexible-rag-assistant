import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/chatApi';
import { AxiosResponse } from 'axios';
import { Box, Button, Grid, LinearProgress, Paper, TextField, Typography } from '@mui/material';

interface Context {
  source: string;
  title: string;
  description: string;
  page_content: string;
}

interface ChatMessage {
  type: 'Human' | 'AI';
  content: string;
  context: Context[] | undefined;
}

interface ChatResponse {
  answer: string;
  context: Context[];
}

function Chat(): JSX.Element {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newPrompt: ChatMessage = {
      type: 'Human',
      content: prompt,
      context: undefined,
    };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newPrompt]);
    setPrompt('');

    // Send chat message to backend
    axiosInstance.post('/chat', { prompt })
      .then((response: AxiosResponse<ChatResponse>) => {
        const newResponse: ChatMessage = {
          type: 'AI',
          content: response.data.answer,
          context: response.data.context,
        };
        setChatHistory((prevChatHistory) => [...prevChatHistory, newResponse]);
      })
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom>Chat</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            ref={chatBoxRef}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            }}
          >
            {chatHistory.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'Human' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
                title={message.type === 'AI' && message.context ? message.context.map(ctx => ctx.page_content).join(' | ') : ''}
                >
                <Paper
                  sx={{
                    p: 1,
                    maxWidth: '70%',
                    backgroundColor: message.type === 'Human' ? 'primary.main' : 'grey.300',
                    color: message.type === 'Human' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          {loading && (
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <LinearProgress />
            </Box>
          )}
        </Paper>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              id="prompt"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Chat;