"use client";

import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig'; // Importa la instancia configurada

const PrincipalPage = () => {
  const [name, setName] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Expresión regular para validar que no haya espacios ni caracteres especiales
  const validateInput = (value) => {
    const regex = /^[a-zA-Z0-9]+$/; // Permite solo letras y números
    return regex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    // Validar el nuevo valor
    if (validateInput(value)) {
      setName(value);
      setErrorMessage(''); // Limpiar el mensaje de error
    } else {
      setErrorMessage('Por favor, usa solo letras y números sin espacios.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Solo procede si no hay un mensaje de error
    if (errorMessage) {
      console.error('Error: ', errorMessage);
      return; // No enviar la solicitud si hay un error
    }

    try {
      const response = await axiosInstance.post('/api/keys/generate', null, {
        params: { name },
      });

      const privateKey = response.data;
      const blob = new Blob([privateKey], { type: 'application/x-pem-file' });
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
    } catch (error) {
      console.error('Error generando la llave:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Generar mi llave privada</h1>
      <p>
        Una llave privada es un componente esencial de la criptografía que permite
        asegurar la comunicación. Al generar una llave privada, recibirás un archivo
        en formato PEM que podrás utilizar para tus operaciones criptográficas.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Ingresa un nombre para el archivo de la llave"
          required
          style={{ padding: '10px', margin: '10px 0', width: '300px' }} // Estilos opcionales para el input
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Mensaje de error */}
        <button type="submit" style={{ padding: '10px 15px' }}>Generar Llave</button>
      </form>
      {downloadLink && (
        <div style={{ marginTop: '20px' }}>
          <a href={downloadLink} download={`${name}.pem`}>
            Descargar Llave Privada
          </a>
        </div>
      )}
    </div>
  );
};

export default PrincipalPage;
