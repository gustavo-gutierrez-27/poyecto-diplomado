// src/components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>Generador de Llave Privada</h1>
      <nav>
        <ul style={styles.navList}>
          <li><a href="/inicio">Inicio</a></li>
          <li><a href="/generate">Generar Llave</a></li>
          <li><a href="/login">Login</a></li> {/* Nuevo enlace de Login */}
        </ul>
      </nav>
      <Image src="/img/logo.png" alt="Logo" className="logo" width={150} height={150} />
    </header>
  );
};

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' },
  navList: { display: 'flex', listStyle: 'none', gap: '15px' }
};

export default Header;
