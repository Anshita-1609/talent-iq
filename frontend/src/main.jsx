import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockAuthProvider } from "./lib/mockAuth.jsx";
import "./lib/debugPiston.js"; // Load debug utility

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MockAuthProvider>
          <App />
        </MockAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
