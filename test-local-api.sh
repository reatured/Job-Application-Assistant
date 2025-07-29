#!/bin/bash

# Test script for local Job Application Assistant API
echo "🚀 Testing Job Application Assistant Local API"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if proxy server is running
echo -e "${BLUE}1. Checking if proxy server is running...${NC}"
if curl -s http://localhost:3001/debug > /dev/null; then
    echo -e "${GREEN}✅ Proxy server is running on port 3001${NC}"
else
    echo -e "${RED}❌ Proxy server is not running!${NC}"
    echo -e "${YELLOW}Please run: npm run proxy${NC}"
    exit 1
fi

# Test 1: Simple non-streaming request
echo -e "\n${BLUE}2. Testing non-streaming API call...${NC}"
curl -X POST http://localhost:3001/api/perplexity/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${REACT_APP_PERPLEXITY_API_KEY:-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}" \
  -d '{
    "model": "sonar",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 20,
    "stream": false
  }' \
  -w "\n\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  -s

# Test 2: Streaming request (first few chunks)
echo -e "\n${BLUE}3. Testing streaming API call...${NC}"
echo -e "${YELLOW}(Showing first 5 seconds of stream)${NC}"
timeout 5s curl -X POST http://localhost:3001/api/perplexity/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${REACT_APP_PERPLEXITY_API_KEY:-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}" \
  -d '{
    "model": "sonar",
    "messages": [{"role": "user", "content": "Write a short paragraph about React"}],
    "max_tokens": 100,
    "stream": true
  }' \
  -N -s

# Test 3: Job application specific request
echo -e "\n\n${BLUE}4. Testing job application improvement...${NC}"
curl -X POST http://localhost:3001/api/perplexity/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${REACT_APP_PERPLEXITY_API_KEY:-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}" \
  -d '{
    "model": "sonar",
    "messages": [{
      "role": "user", 
      "content": "Job Description: Software Engineer at Google\n\nResume: 3 years React experience\n\nQuestion: Why do you want to work here?\n\nDraft Answer: I like Google\n\nPlease provide an improved answer for this job application question."
    }],
    "max_tokens": 150,
    "stream": false
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq -r '.choices[0].message.content // .error // .'

echo -e "\n${GREEN}✅ Local API tests completed!${NC}"
echo -e "${BLUE}To start the full application:${NC}"
echo -e "${YELLOW}npm run dev${NC}"