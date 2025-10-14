import { createContext, useContext, useState } from 'react';
import { history, localStorageManager } from '../lib/utils';

type AuthContextType = {
  isAuthenticated: boolean;
  logout: () => void;
  login: () => void;
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    localStorageManager.removeToken();
    localStorageManager.removeRefreshToken();
    localStorageManager.removeName();
    history?.push('/login');
  };

  const login = () => {
    setIsAuthenticated(true);
  }

  const getAccessToken = () => {
    return localStorageManager.getToken();
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      logout,
      login,
      getAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
