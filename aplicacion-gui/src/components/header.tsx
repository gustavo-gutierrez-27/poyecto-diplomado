// src/components/Header.tsx
import React from 'react';

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
      <img src={"../img/logo.png"} alt="Logo" className="logo" />
    </header>
  );
};

export default Header;
