// src/components/ProtectedRoute.tsx
"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <h2>Es necesario autenticarse para usar esta opción</h2>
        <p>Por favor, inicia sesión para continuar.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
