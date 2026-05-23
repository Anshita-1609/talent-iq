/**
 * Debug utility to test Piston API connection
 * Run in browser console: testPiston()
 */

export async function testPiston() {
  console.log("🔍 Testing Piston API connection...");
  
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "javascript",
        version: "18.15.0",
        files: [
          {
            name: "test.js",
            content: "console.log('Piston API Test');",
          },
        ],
      }),
    });

    console.log("✅ Response Status:", response.status);
    console.log("✅ Response OK:", response.ok);

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Error Response:", text);
      return {
        success: false,
        status: response.status,
        error: text,
      };
    }

    const data = await response.json();
    console.log("✅ Response Data:", data);

    if (data.run) {
      console.log("✅ Piston API is working!");
      console.log("   Output:", data.run.output);
      return { success: true, data };
    } else {
      console.error("❌ Unexpected response format:", data);
      return { success: false, error: "Unexpected response format" };
    }
  } catch (error) {
    console.error("❌ Piston API Connection Error:", error);
    return { success: false, error: error.message };
  }
}

// Make it available globally in browser console
window.testPiston = testPiston;

console.log(
  "🔧 Piston debug utility loaded. Run testPiston() in console to test the API."
);
