"use client"; // Asegúrate de que este archivo es un componente de cliente

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta correctamente
import { useRouter } from 'next/navigation';
import '../app/styles/globals.css'; // Asegúrate de que los estilos globales estén importados

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      router.push('/login'); // Redirige a la página de login
    }
  };

  return (
    <header style={styles.header}>
      <h1>Generador de Llave Privada</h1>
      <nav>
        <ul style={styles.navList}>
          <li><a href="/inicio">Inicio</a></li>
          {isAuthenticated && ( // Solo renderiza este enlace si el usuario está autenticado
            <>
              <li><a href="/generate">Generar Llave</a></li>
              <li><a href="/archivos">Gestión de Archivos</a></li> {/* Agregar la opción de gestión de archivos */}
            </>
          )}
          <li>
            <a onClick={handleAuthAction} className="auth-link">
              {isAuthenticated ? 'Cerrar Sesión' : 'Login'}
            </a>
          </li>
        </ul>
      </nav>
      <Image src="/img/logo.png" alt="Logo" className="logo" width={150} height={150} />
    </header>
  );
};

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' },
  navList: { display: 'flex', listStyle: 'none', gap: '15px' },
};

export default Header;
