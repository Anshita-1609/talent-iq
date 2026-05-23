import { createContext, useContext, useState, useEffect } from "react";
import { normalizeMockUser } from "./mockUser";

// Mock Auth Context to replace Clerk when not configured
const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for mock user in localStorage
    const mockUser = localStorage.getItem("mockUser");
    if (mockUser) {
      const parsed = JSON.parse(mockUser);
      const normalized = normalizeMockUser(parsed);
      setUser(normalized);
      localStorage.setItem("mockUser", JSON.stringify(normalized));
    }
    setIsLoaded(true);
  }, []);

  const signOut = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  const value = {
    user,
    isSignedIn: !!user,
    isLoaded,
    signOut,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    return { user: null, isSignedIn: false, isLoaded: true, signOut: () => {} };
  }
  return context;
};

export const useAuth = () => {
  return useContext(MockAuthContext);
};