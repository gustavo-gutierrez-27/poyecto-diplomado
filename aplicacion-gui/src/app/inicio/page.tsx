
import React from 'react';

const InicioPage: React.FC = () => {
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
    </div>
  );
};

export default InicioPage;
