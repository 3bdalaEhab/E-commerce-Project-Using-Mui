import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react';

// Types
interface TokenContextType {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  logout: () => void;
}

interface TokenContextProviderProps {
  children: ReactNode;
}

// Create Context with proper typing
export const tokenContext = createContext<TokenContextType>({
  userToken: null,
  setUserToken: () => { },
  isAuthenticated: false,
  logout: () => { },
});

export default function TokenContextProvider({ children }: TokenContextProviderProps) {
  const [userToken, setUserToken] = useState<string | null>(() => {
    return localStorage.getItem('userToken');
  });

  const logout = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
  };

  // Memoize context value
  const contextValue = useMemo<TokenContextType>(
    () => ({
      userToken,
      setUserToken,
      isAuthenticated: !!userToken,
      logout,
    }),
    [userToken]
  );

  return (
    <tokenContext.Provider value={contextValue}>
      {children}
    </tokenContext.Provider>
  );
}

// Custom hook for type-safe context usage
export const useAuth = (): TokenContextType => {
  const context = useContext(tokenContext);
  if (!context) {
    throw new Error('useAuth must be used within a TokenContextProvider');
  }
  return context;
};