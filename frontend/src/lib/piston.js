// Code execution via backend (public Piston API at emkc.org requires whitelist as of 2026)

import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const response = await axiosInstance.post("/code/execute", { language, code });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Failed to execute code. Is the backend server running?";
    console.error("Code execution error:", message);
    return {
      success: false,
      error: message,
    };
  }
}
