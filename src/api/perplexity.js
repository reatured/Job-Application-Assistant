const PERPLEXITY_API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/proxy' 
  : 'http://localhost:3001/api/perplexity/chat/completions';

export const callPerplexityAPI = async (prompt, onChunk, apiKey = null) => {
  try {
    const finalApiKey = apiKey || process.env.REACT_APP_PERPLEXITY_API_KEY || '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';
    console.log('Using API key:', finalApiKey ? 'Present' : 'Missing');
    console.log('Env var:', process.env.REACT_APP_PERPLEXITY_API_KEY ? 'Found' : 'Not found');
    
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.2,
        top_p: 0.9,
        stream: true,
        return_citations: true,
        search_domain_filter: ["perplexity.ai"],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month"
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const jsonStr = line.slice(6);
            if (jsonStr.trim()) {
              const data = JSON.parse(jsonStr);
              const content = data.choices?.[0]?.delta?.content;
              
              if (content) {
                fullMessage += content;
                if (onChunk) {
                  onChunk(content, fullMessage);
                }
              }
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', parseError);
          }
        }
      }
    }

    return {
      success: true,
      message: fullMessage,
      citations: []
    };
  } catch (error) {
    console.error('Perplexity API call failed:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export default callPerplexityAPI;