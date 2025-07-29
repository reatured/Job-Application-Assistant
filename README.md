# Job Application Assistance Tool

An AI-powered job application assistant that helps improve your interview answers using real-time streaming responses from Perplexity AI.

## Features

- **Three-column layout**: Job description, resume, and question/answer panels
- **AI-powered assistance**: Real-time streaming responses from Perplexity AI
- **Smart summarization**: Summarize long job descriptions and resumes while preserving key details
- **Data persistence**: Automatic saving to localStorage
- **Real streaming**: Genuine API streaming (not fake animation)

## Setup

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-react-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_PERPLEXITY_API_KEY=your-perplexity-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   This starts both the proxy server (port 3001) and React app (port 3000).

### Deployment on Vercel

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `REACT_APP_PERPLEXITY_API_KEY`
   - Deploy!

3. **Environment Variables on Vercel**
   In your Vercel dashboard, add:
   - `REACT_APP_PERPLEXITY_API_KEY`: Your Perplexity API key

## Usage

1. **Paste job description** in the left panel
2. **Paste your resume** in the right panel  
3. **Enter interview question** in the middle panel
4. **Add your draft answer** (optional)
5. **Add additional comments** for context (optional)
6. **Click "Generate Improved Answer"** to get AI assistance

### Summarization

- Click **"Summarize"** next to job description or resume titles
- The AI will condense lengthy content while preserving all critical details
- Summaries stream in real-time directly into the textareas

## Architecture

- **Frontend**: React.js with localStorage persistence
- **API Integration**: Perplexity AI with real streaming
- **Proxy Server**: Node.js/Express for CORS handling (local) / Vercel serverless functions (production)
- **Deployment**: Vercel with serverless functions

## API Key

Get your Perplexity API key from [Perplexity AI Settings](https://www.perplexity.ai/settings/api).

## Security

- API keys are stored in environment variables
- Never commit API keys to git
- The `.env` file is gitignored for security

---

## Available Scripts

### `npm start`
Runs the React app only (for production build testing)

### `npm run dev`
Runs both proxy server and React app for development

### `npm run build`
Builds the app for production

### `npm test`
Runs the test suite
