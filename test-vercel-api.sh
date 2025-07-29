#!/bin/bash

# Test script for Vercel deployed Job Application Assistant API
echo "🌐 Testing Job Application Assistant Vercel API"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set the Vercel URL (replace with your actual URL)
VERCEL_URL="https://job-application-assistant-ldo1540n2-reatureds-projects.vercel.app"

# Test 1: Check if the frontend is accessible
echo -e "${BLUE}1. Testing frontend accessibility...${NC}"
if curl -s "${VERCEL_URL}" > /dev/null; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${RED}❌ Frontend is not accessible!${NC}"
fi

# Test 2: Test API endpoint
echo -e "\n${BLUE}2. Testing API endpoint...${NC}"
curl -X POST "${VERCEL_URL}/api/proxy" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${REACT_APP_PERPLEXITY_API_KEY:-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}" \
  -d '{
    "model": "sonar",
    "messages": [{"role": "user", "content": "Hello from Vercel deployment test"}],
    "max_tokens": 20,
    "stream": false
  }' \
  -w "\n\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  -s

echo -e "\n${GREEN}✅ Vercel API test completed!${NC}"
echo -e "${BLUE}Your app is deployed at: ${VERCEL_URL}${NC}"