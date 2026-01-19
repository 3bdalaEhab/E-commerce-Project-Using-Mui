import React, { createContext, useState, useContext, useMemo, ReactNode, useCallback } from 'react';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';
import { validateToken } from '../utils/security';

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
// eslint-disable-next-line react-refresh/only-export-components
export const tokenContext = createContext<TokenContextType>({
  userToken: null,
  setUserToken: () => { },
  isAuthenticated: false,
  logout: () => { },
});

export default function TokenContextProvider({ children }: TokenContextProviderProps) {
  const [userToken, setUserToken] = useState<string | null>(() => {
    const token = storage.get<string>('userToken');
    // Validate token on initialization
    if (token && validateToken(token)) {
      return token;
    }
    // Remove invalid token
    if (token) {
      storage.remove('userToken');
      logger.warn('Invalid token removed on initialization', 'TokenContext');
    }
    return null;
  });

  // Enhanced logout with logging
  const logout = useCallback(() => {
    logger.info('User logged out', 'TokenContext');
    storage.remove('userToken');
    setUserToken(null);
  }, []);

  // Memoize context value
  const contextValue = useMemo<TokenContextType>(
    () => ({
      userToken,
      setUserToken,
      isAuthenticated: !!userToken,
      logout,
    }),
    [userToken, logout]
  );

  return (
    <tokenContext.Provider value={contextValue}>
      {children}
    </tokenContext.Provider>
  );
}

// Custom hook for type-safe context usage
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): TokenContextType => {
  const context = useContext(tokenContext);
  if (!context) {
    throw new Error('useAuth must be used within a TokenContextProvider');
  }
  return context;
};