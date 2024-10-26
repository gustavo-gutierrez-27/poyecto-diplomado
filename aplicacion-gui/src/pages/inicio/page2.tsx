// src/pages/inicio.tsx
import React from 'react';
import Header from '../../components/header'; // Asegúrate de que esta ruta sea correcta
import Footer from '../../components/footer'; // Asegúrate de que esta ruta sea correcta

const InicioPage = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Introducción a la Generación de Llaves Privadas</h1>
        <p>
          En esta página, aprenderás sobre la generación de llaves privadas y públicas.
          Estas llaves son esenciales para la criptografía y se descargarán en formato PEM.
        </p>
        <p>
          Las llaves privadas son utilizadas para asegurar la autenticidad de tus mensajes
          y son cruciales para el funcionamiento de diversas aplicaciones de seguridad.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default InicioPage;
