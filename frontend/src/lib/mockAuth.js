import { createContext, useContext, useState, useEffect } from 'react';

// Mock Auth Context to replace Clerk when not configured
const MockAuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for mock user in localStorage
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
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
    // Fallback for when Clerk is available
    try {
      const { useUser: clerkUseUser } = require('@clerk/clerk-react');
      return clerkUseUser();
    } catch {
      throw new Error('Auth context not available');
    }
  }
  return context;
};

export const useAuth = () => {
  return useContext(MockAuthContext);
};