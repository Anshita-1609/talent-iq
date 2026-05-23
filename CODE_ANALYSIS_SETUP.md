# Code Analysis Feature - Setup Guide

## 🚀 Quick Start

### 1. Configure OpenAI API Key
Add your OpenAI API key to your backend `.env` file:
```
OPENAI_API_KEY=sk-your-key-here
```

You can get an API key from [OpenAI Platform](https://platform.openai.com/account/api-keys)

### 2. Restart Backend Server
```bash
cd backend
npm run dev
```

### 3. Start Frontend (if not running)
```bash
cd frontend
npm run dev
```

---

## 📋 Features Overview

### Code Submission & Compilation
- Write code in the editor
- Click "Run Code" button
- The code is executed using the Piston API
- Output appears in the "Output" tab

### AI Code Analysis
After running code, automatically triggers analysis that:
- ✅ Checks code correctness
- 🔍 Finds potential errors and warnings
- ⚡ Analyzes time and space complexity
- 💡 Suggests improvements and optimizations
- 📊 Provides detailed feedback

### Output Panel Tabs
The output panel has two tabs:

**Output Tab:**
- Shows code execution result
- Displays errors if code fails
- Shows console output

**AI Analysis Tab:**
- **Correctness**: Pass/fail status with specific issues
- **Complexity**: Time/Space complexity with ratings
- **Feedback**: Strengths and areas for improvement
- **Improvements**: Specific optimization suggestions

---

## 🔌 API Endpoint Details

### Analyze Code
**POST** `/api/code/analyze`

**Request:**
```json
{
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript",
  "problemId": "two-sum",
  "problemDescription": "Given an array of integers...",
  "codeOutput": "Output from running the code"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "correctness": {...},
    "complexity": {...},
    "feedback": {...},
    "improvements": [...]
  },
  "timestamp": "2024-04-27T..."
}
```

---

## 🎯 Workflow Example

1. **Visit Problem Page**: `/problem/two-sum`
2. **Edit Code**: Modify the solution in the editor
3. **Run**: Click "Run Code" button
4. **View Output**: Check the "Output" tab to see execution result
5. **View Analysis**: Click "AI Analysis" tab to see AI-powered feedback
6. **Implement Suggestions**: Use the feedback to improve your code
7. **Test Again**: Re-run to verify improvements

---

## ⚙️ Supported Languages

- JavaScript
- Python
- Java

The AI analysis works for all supported languages.

---

## 🛠️ Backend Implementation

### Files Created/Modified

**Created:**
- `backend/src/controllers/codeAnalysisController.js` - AI analysis logic
- `backend/src/routes/codeRoutes.js` - API routes

**Modified:**
- `backend/src/lib/env.js` - Added OPENAI_API_KEY
- `backend/src/server.js` - Registered code routes

### AI Model
Uses **Claude 3.5 Sonnet** for precise code analysis

---

## 🎨 Frontend Implementation

### Files Modified

**Updated:**
- `frontend/src/components/OutputPanel.jsx` - Added tabs and analysis display
- `frontend/src/pages/ProblemPage.jsx` - Added analysis state and API integration

### User Experience
- Loading spinner while analysis is running
- Error handling with toast notifications
- Responsive UI with collapsible sections
- Color-coded badges for issue severity
- Smooth transitions between tabs

---

## 🐛 Troubleshooting

### Analysis not appearing?
- Check OpenAI API key is correctly set in `.env`
- Verify backend is running: `npm run dev` from backend folder
- Check browser console for errors

### Code not running?
- Ensure Piston API service is accessible
- Check code syntax
- View error in "Output" tab

### Getting API errors?
- Verify OpenAI API key is valid
- Check API rate limits on OpenAI dashboard
- See server logs for detailed error messages

---

## 📈 Performance Notes

- Code execution: <5 seconds (Piston API)
- AI analysis: 2-10 seconds (OpenAI API)
- Analysis runs in background, doesn't block UI
- All requests are rate-limited and error-handled

---

## 🔐 Security

- OpenAI API key stored in backend `.env` only
- Frontend never has direct access to API keys
- All API calls go through backend
- Code is only analyzed on explicit user request

---

## 📚 Next Steps

- Test with various code examples
- Monitor OpenAI API usage and costs
- Adjust analysis prompts if needed
- Consider adding more problem types
- Add caching for repeated analyses

