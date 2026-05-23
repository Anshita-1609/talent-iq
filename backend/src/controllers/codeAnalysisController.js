import { OpenAI } from "openai";
import { ENV } from "../lib/env.js";

function createAiClient() {
  if (ENV.GROQ_API_KEY) {
    return new OpenAI({
      apiKey: ENV.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  if (ENV.OPENAI_API_KEY) {
    return new OpenAI({ apiKey: ENV.OPENAI_API_KEY });
  }

  return null;
}

function getAiModel() {
  if (ENV.GROQ_API_KEY) return "llama-3.3-70b-versatile";
  if (ENV.OPENAI_API_KEY) return "gpt-4o-mini";
  return null;
}

function parseAnalysisJson(responseText) {
  const trimmed = responseText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

/**
 * Analyzes submitted code using Groq (preferred) or OpenAI
 */
async function analyzeCode(code, language, problemId, problemDescription, codeOutput) {
  try {
    const client = createAiClient();
    const model = getAiModel();

    if (!client || !model) {
      return {
        success: false,
        error: "No AI API key configured. Set GROQ_API_KEY or OPENAI_API_KEY in backend/.env",
      };
    }

    const analysisPrompt = `You are an expert code reviewer. Analyze the following ${language} code submission for a coding problem.

Problem: ${problemDescription}
Language: ${language}
Code Output: ${codeOutput || "No output"}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Please provide a detailed analysis in JSON format with the following structure:
{
  "correctness": {
    "isCorrect": boolean,
    "issues": [
      {
        "type": "error|warning|suggestion",
        "line": line_number_or_null,
        "description": "description of the issue"
      }
    ]
  },
  "improvements": [
    {
      "category": "performance|readability|efficiency|design",
      "description": "improvement suggestion",
      "example": "code example if applicable"
    }
  ],
  "complexity": {
    "timeComplexity": "O(...) description",
    "spaceComplexity": "O(...) description",
    "rating": "optimized|average|suboptimal"
  },
  "feedback": {
    "strengths": ["strength 1", "strength 2"],
    "areasForImprovement": ["area 1", "area 2"],
    "overallAssessment": "brief overall assessment"
  }
}

Provide ONLY the JSON response, no additional text.`;

    const message = await client.chat.completions.create({
      model,
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    });

    const responseText = message.choices[0].message.content;
    const analysis = parseAnalysisJson(responseText);

    return {
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Code analysis error:", error);
    return {
      success: false,
      error: `Failed to analyze code: ${error.message}`,
    };
  }
}

/**
 * POST /api/code/analyze
 * Analyzes submitted code and provides feedback
 */
export async function submitCodeAnalysis(req, res) {
  try {
    const { code, language, problemId, problemDescription, codeOutput } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: code, language, problemId",
      });
    }

    const analysisResult = await analyzeCode(
      code,
      language,
      problemId,
      problemDescription || "User submitted code",
      codeOutput || ""
    );

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Code submission error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process code submission",
    });
  }
}
