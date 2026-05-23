import { runCodeLocally } from "../lib/codeRunner.js";

/**
 * POST /api/code/execute
 * Runs code on the backend (replaces blocked public Piston API).
 */
export async function executeCodeHandler(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: language, code",
      });
    }

    const result = await runCodeLocally(language, code);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Code execution error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to execute code",
    });
  }
}
