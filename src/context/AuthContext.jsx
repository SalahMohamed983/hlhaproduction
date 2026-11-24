import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('unauthorized', handleUnauthorized);
    
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await apiClient('/api/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user', error);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    loadUser();

    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem('accessToken', res.accessToken);
      setUser(res.user);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
