const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Debug endpoint
app.get('/debug', (req, res) => {
  res.json({ 
    message: 'Proxy server is running',
    headers: req.headers 
  });
});

// Custom proxy endpoint for Perplexity API
app.post('/api/perplexity/chat/completions', async (req, res) => {
  try {
    console.log('=== PROXY REQUEST ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Authorization header:', req.headers.authorization);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
      },
      body: JSON.stringify(req.body)
    });

    console.log('Perplexity API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // Handle non-streaming response
    const data = await response.json();
    
    // Log token usage if available
    if (data.usage) {
      console.log('Token usage:', JSON.stringify(data.usage, null, 2));
    }
    
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});