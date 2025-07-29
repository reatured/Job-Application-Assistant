import React, { useState, useEffect } from 'react';
import './App.css';
import { callPerplexityAPI } from './api/perplexity';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [question, setQuestion] = useState('');
  const [draftAnswer, setDraftAnswer] = useState('');
  const [additionalComments, setAdditionalComments] = useState('Edit this to sound like a real person, not AI. Keep it concise. No fluff, no exaggeration, no made-up skills. No typos. If this version wouldn’t help me land the job, it’s useless.');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizingJob, setIsSummarizingJob] = useState(false);
  const [isSummarizingResume, setIsSummarizingResume] = useState(false);

  // Debug: Check if environment variable is loaded
  console.log('Environment variable loaded:', process.env.REACT_APP_PERPLEXITY_API_KEY ? 'Yes' : 'No');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedJobDescription = localStorage.getItem('jobDescription');
    const savedResume = localStorage.getItem('resume');
    const savedQuestion = localStorage.getItem('question');
    const savedDraftAnswer = localStorage.getItem('draftAnswer');
    const savedAdditionalComments = localStorage.getItem('additionalComments');
    const savedResponse = localStorage.getItem('response');

    if (savedJobDescription) setJobDescription(savedJobDescription);
    if (savedResume) setResume(savedResume);
    if (savedQuestion) setQuestion(savedQuestion);
    if (savedDraftAnswer) setDraftAnswer(savedDraftAnswer);
    if (savedAdditionalComments) setAdditionalComments(savedAdditionalComments);
    if (savedResponse) setResponse(savedResponse);
  }, []);

  // Save functions
  const saveJobDescription = (value) => {
    setJobDescription(value);
    localStorage.setItem('jobDescription', value);
  };

  const saveResume = (value) => {
    setResume(value);
    localStorage.setItem('resume', value);
  };

  const saveQuestion = (value) => {
    setQuestion(value);
    localStorage.setItem('question', value);
  };

  const saveDraftAnswer = (value) => {
    setDraftAnswer(value);
    localStorage.setItem('draftAnswer', value);
  };

  const saveAdditionalComments = (value) => {
    setAdditionalComments(value);
    localStorage.setItem('additionalComments', value);
  };

  const saveResponse = (value) => {
    setResponse(value);
    localStorage.setItem('response', value);
  };

  const summarizeJobDescription = async () => {
    if (!jobDescription.trim()) return;
    
    setIsSummarizingJob(true);
    saveJobDescription(''); // Clear the textarea
    const prompt = `Please summarize the following job description in simple JSON format. Keep all critical requirements, skills, responsibilities, and qualifications. Maintain accuracy and preserve important details while making it more concise and reducing length only if too long:\n\n${jobDescription}`;
    
    try {
      const result = await callPerplexityAPI(prompt, (chunk, fullMessage) => {
        // Stream directly into the job description textarea
        saveJobDescription(fullMessage);
      });
      
      if (!result.success) {
        saveJobDescription(jobDescription); // Restore original on error
      }
    } catch (error) {
      console.error('Summarization failed:', error);
      saveJobDescription(jobDescription); // Restore original on error
    } finally {
      setIsSummarizingJob(false);
    }
  };

  const summarizeResume = async () => {
    if (!resume.trim()) return;
    
    const originalResume = resume; // Store original
    setIsSummarizingResume(true);
    saveResume(''); // Clear the textarea
    const prompt = `Please summarize the following resume in simple JSON format. Keep all key skills, experiences, achievements, and qualifications. Maintain accuracy and preserve important details while making it more concise and reducing length only if too long:\n\n${originalResume}`;
    
    try {
      const result = await callPerplexityAPI(prompt, (chunk, fullMessage) => {
        // Stream directly into the resume textarea
        saveResume(fullMessage);
      });
      
      if (!result.success) {
        saveResume(originalResume); // Restore original on error
      }
    } catch (error) {
      console.error('Summarization failed:', error);
      saveResume(originalResume); // Restore original on error
    } finally {
      setIsSummarizingResume(false);
    }
  };

  const handleCoverLetterClick = () => {
    saveQuestion('Cover Letter');
    saveDraftAnswer('Search what the company do. Mention I am interested in working at this industry and my skills and knoweledge are great for this job');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    saveResponse('');

    const prompt = `Job Description:\n${jobDescription}\n\nResume:\n${resume}\n\nQuestion:\n${question}\n\nDraft Answer:\n${draftAnswer}\n\nAdditional Comments:\n${additionalComments}\n\nPlease provide an improved answer for this job application question based on the job description and resume. Consider the additional comments provided.`;

    try {
      const result = await callPerplexityAPI(prompt, (chunk, fullMessage) => {
        // This callback is called for each streaming chunk
        saveResponse(fullMessage);
      });
      
      if (!result.success) {
        saveResponse(`Error: ${result.error}`);
      }
    } catch (error) {
      saveResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="App-container">
        <h1>Job application assistance</h1>
        
        <div className="main-layout">
          <div className="left-panel">
            <div className="title-with-button">
              <h3>Job Description</h3>
              <button 
                onClick={summarizeJobDescription}
                disabled={isSummarizingJob || !jobDescription.trim()}
                className="summarize-button"
              >
                {isSummarizingJob ? 'Summarizing...' : 'Summarize'}
              </button>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => saveJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="panel-textarea"
              style={{marginBottom: '10px'}}
            />
            <div className="title-with-button">
              <h3>Resume</h3>
              <button 
                onClick={summarizeResume}
                disabled={isSummarizingResume || !resume.trim()}
                className="summarize-button"
              >
                {isSummarizingResume ? 'Summarizing...' : 'Summarize'}
              </button>
            </div>
            <textarea
              value={resume}
              onChange={(e) => saveResume(e.target.value)}
              placeholder="Paste your resume here..."
              className="panel-textarea"
              
            />
            
          </div>
    
          <div className="middle-panel">
            
            <div className="question-section">
              <h3>Question</h3>
              <button onClick={handleCoverLetterClick} className="cover-letter-button">Cover Letter</button>
              <textarea
                value={question}
                onChange={(e) => saveQuestion(e.target.value)}
                placeholder="Paste interview/application question here..."
                className="panel-textarea small"
              />
            </div>
            
            <div className="draft-section" style={{flex: 1}}>
              <h3>Draft Answer</h3>
              <textarea
                value={draftAnswer}
                onChange={(e) => saveDraftAnswer(e.target.value)}
                placeholder="Paste your draft answer here..."
                className="panel-textarea"
              />
              
              
            </div>
            
            
            
            <div className="comments-section" style={{flex: 1}}>
              <h3>Additional Comments</h3>
              <textarea
                value={additionalComments}
                onChange={(e) => saveAdditionalComments(e.target.value)}
                placeholder="Add any additional context or specific requirements..."
                className="panel-textarea "
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isLoading || !question.trim()}
              className="submit-button"
            >
              {isLoading ? 'Generating...' : 'Generate Improved Answer'}
            </button>
            
            
          </div>

          <div className="right-panel">
          <div className="answer-section">
              <h3>Improved Answer</h3>
              <textarea
                value={response || ''}
                onChange={(e) => saveResponse(e.target.value)}
                placeholder='Click "Generate Improved Answer" to get an AI-improved response.'
                className="panel-textarea response-textarea"
              />
            </div>

          </div>

          
        </div>
      </div>
    </div>
  );
}

export default App;
