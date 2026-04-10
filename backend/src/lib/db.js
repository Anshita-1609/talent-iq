import { ENV } from "./env.js";

// JSON file-based database connection (no-op)
export const connectDB = async () => {
  console.log("Using JSON file-based storage. No database connection needed.");
};
