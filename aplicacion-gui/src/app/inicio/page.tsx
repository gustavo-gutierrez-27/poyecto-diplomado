"use client"; // Asegúrate de que este archivo es un componente de cliente

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta según tu estructura

const InicioPage: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación

  return (
    <div>
      <h1>Introducción a la Generación de Llaves</h1>
      <p>
        En criptografía, las llaves públicas y privadas son esenciales para la seguridad de las comunicaciones digitales. 
        Estas llaves son parte de un sistema de criptografía asimétrica, donde cada usuario posee un par de llaves: una 
        llave pública y una llave privada.
      </p>
      <p>
        La <strong>llave pública</strong> se utiliza para cifrar mensajes y puede ser compartida con cualquier persona. 
        Cualquier mensaje cifrado con la llave pública solo puede ser descifrado por la llave privada correspondiente, 
        que se mantiene en secreto y nunca debe ser compartida. Esto garantiza que solo el propietario de la llave privada 
        pueda acceder a la información protegida.
      </p>
      <p>
        Por otro lado, la <strong>llave privada</strong> es un secreto que se utiliza para descifrar mensajes que han sido 
        cifrados con la llave pública. Es crucial que esta llave se mantenga en un lugar seguro, ya que cualquier persona 
        que tenga acceso a ella puede descifrar la información destinada al propietario de la llave.
      </p>
      <p>
        En esta aplicación, podrás generar llaves privadas en formato PEM. Ten en cuenta que solo se permiten descargas de 
        llaves privadas. Asegúrate de guardar tu llave privada en un lugar seguro y protegido, ya que es fundamental para 
        mantener la integridad y la confidencialidad de tus datos.
      </p>
      {!isAuthenticated && ( // Mostrar solo si no está autenticado
        <p style={styles.motivation}>
          ¡Para comenzar a generar y descargar tus llaves privadas, por favor inicia sesión! La seguridad de tus datos es 
          primordial, y estamos aquí para ayudarte a mantenerla. 
        </p>
      )}
    </div>
  );
};

const styles = {
  motivation: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f8ff', // Color de fondo suave
    border: '1px solid #007bff', // Borde azul
    borderRadius: '5px', // Esquinas redondeadas
    color: '#007bff', // Color del texto
  },
};

export default InicioPage;
