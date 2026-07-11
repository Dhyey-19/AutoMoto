'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSession = () => {
      try {
        const storedToken = localStorage.getItem('automoto_token');
        const storedUser = localStorage.getItem('automoto_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to load session from local storage', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { user: userData, token: userToken } = response.data;
      
      localStorage.setItem('automoto_token', userToken);
      localStorage.setItem('automoto_user', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${userData.FullName}!`);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const msg = error.friendlyMessage || 'Invalid email or password.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authService.register(name, email, password);
      const { user: userData, token: userToken } = response.data;
      
      localStorage.setItem('automoto_token', userToken);
      localStorage.setItem('automoto_user', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success(`Account created! Welcome, ${userData.FullName}!`);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const msg = error.friendlyMessage || 'Registration failed.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('automoto_token');
    localStorage.removeItem('automoto_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('automoto_user', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully.');
  };

  const isAdmin = user?.Role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
