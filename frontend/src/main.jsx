import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockAuthProvider } from "./lib/mockAuth";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if Clerk is properly configured
const isClerkEnabled = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== "your_clerk_publishable_key";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {isClerkEnabled ? (
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
          </ClerkProvider>
        ) : (
          <MockAuthProvider>
            <App />
          </MockAuthProvider>
        )}
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
