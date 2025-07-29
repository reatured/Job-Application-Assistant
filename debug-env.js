// Quick script to test environment variable loading
console.log('Environment variable check:');
console.log('REACT_APP_PERPLEXITY_API_KEY:', process.env.REACT_APP_PERPLEXITY_API_KEY ? 'SET' : 'NOT SET');
console.log('First 10 chars:', process.env.REACT_APP_PERPLEXITY_API_KEY?.substring(0, 10) || 'N/A');

// Test API call
const apiKey = process.env.REACT_APP_PERPLEXITY_API_KEY || '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';
console.log('Using API key:', apiKey ? 'Present' : 'Missing');

// Quick API test
fetch('http://localhost:3001/api/perplexity/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'sonar',
    messages: [{ role: 'user', content: 'Test' }],
    max_tokens: 10,
    stream: false
  })
})
.then(response => {
  console.log('API Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('API Response:', data.choices?.[0]?.message?.content || data.error || 'Success!');
})
.catch(err => {
  console.error('API Error:', err.message);
});