import axios from "axios";
import { getClerkIdForAuth } from "./mockUser";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

axiosInstance.interceptors.request.use((config) => {
  const mockUser = localStorage.getItem("mockUser");
  if (mockUser) {
    try {
      const user = JSON.parse(mockUser);
      const clerkId = getClerkIdForAuth(user);
      if (clerkId) {
        config.headers["X-Mock-User-Clerk-Id"] = clerkId;
      }
    } catch {
      /* ignore invalid mock user */
    }
  }
  return config;
});

export default axiosInstance;
