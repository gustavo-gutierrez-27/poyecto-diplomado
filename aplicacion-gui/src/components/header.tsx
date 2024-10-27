// src/components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header>
      <h1>Generador de Llave Privada</h1>
      <nav>
        <ul>
          <li><a href="/inicio">Inicio</a></li>
          <li><a href="/generate">Generar Llave</a></li>
        </ul>
      </nav>
      {/* Cambiamos img por Image y ajustamos la ruta */}
      <Image src="/img/logo.png" alt="Logo" className="logo" width={150} height={150} />
    </header>
  );
};

export default Header;
