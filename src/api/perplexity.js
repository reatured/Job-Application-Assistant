const PERPLEXITY_API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/proxy' 
  : 'http://localhost:3001/api/perplexity/chat/completions';

export const callPerplexityAPI = async (prompt, onChunk, apiKey = null) => {
  try {
    const finalApiKey = apiKey || process.env.REACT_APP_PERPLEXITY_API_KEY || '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';
    
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
        stream: false,
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

    const data = await response.json();
    const fullMessage = data.choices?.[0]?.message?.content || 'No response content';
    
    console.log('Final response:', fullMessage);
    
    // If onChunk callback is provided, call it once with the complete message
    if (onChunk) {
      onChunk(fullMessage, fullMessage);
    }
    
    return {
      success: true,
      message: fullMessage,
      citations: data.citations || []
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