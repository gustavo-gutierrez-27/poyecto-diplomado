"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/axiosConfig';

// Define el tipo del contexto
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      router.push('/inicio'); // Cambia a la ruta a la que quieras redirigir
    } catch (error) {
      console.error('Error durante el inicio de sesión', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login'); // Redirigir al login al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe estar dentro de un AuthProvider');
  }
  return context;
};
