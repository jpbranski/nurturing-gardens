'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setOpen(!open);
    setError(null);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || rateLimited) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'rate_limited') {
          setRateLimited(true);
          setError(data.message || "You've reached today's question limit. Come back tomorrow!");
        } else {
          setError(data.error || 'Failed to get response. Please try again.');
        }
        setLoading(false);
        return;
      }

      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <Collapse in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 90 },
            right: { xs: 16, sm: 24 },
            width: { xs: 'calc(100% - 32px)', sm: 380 },
            maxWidth: 380,
            height: { xs: 'calc(100% - 100px)', sm: 500 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Ask a Gardener
              </Typography>
              <Typography variant="caption">
                AI-powered gardening helper
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleToggle}
              sx={{ color: 'primary.contrastText' }}
              aria-label="Close chat"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Disclaimer */}
          {messages.length === 0 && (
            <Alert severity="info" sx={{ m: 2 }}>
              I'm an AI Master Gardener helper. I can answer general gardening questions, with a
              special love for native and pollinator plants. For pet safety and local regulations,
              always check trusted local sources.
            </Alert>
          )}

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.length === 0 && !error && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Ask me anything about gardening!
              </Typography>
            )}

            <List sx={{ p: 0 }}>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    p: 0,
                    mb: 1,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                      color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {error && (
              <Alert severity={rateLimited ? 'warning' : 'error'} sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={rateLimited ? 'Rate limited - come back tomorrow' : 'Type your question...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || rateLimited}
                multiline
                maxRows={3}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || loading || rateLimited}
                aria-label="Send message"
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Floating Action Button */}
      {!open && (
        <Fab
          color="primary"
          aria-label="Open chat with Master Gardener"
          onClick={handleToggle}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1300,
          }}
        >
          <ChatIcon />
        </Fab>
      )}
    </>
  );
}
