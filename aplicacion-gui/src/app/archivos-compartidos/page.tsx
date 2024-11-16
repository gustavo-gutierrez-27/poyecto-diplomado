"use client";

import { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import axiosInstance from '@/axiosConfig';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

// Definimos la interfaz para las firmas
interface Signature {
  user: string;   // Nombre de usuario que firmó el archivo
  valid: boolean; // Si la firma es válida o no
}

// Definimos la interfaz para los archivos compartidos
interface SharedFileData {
  id: number;
  name: string;
  signUser: string | null;  // Firma del usuario actual (si existe)
  validUser: boolean;      // Si la firma del usuario actual es válida o no
  signatures: Signature[]; // Lista de firmas con información detallada
}

const SharedFileManagerPage = () => {
  const router = useRouter();
  const [files, setFiles] = useState<SharedFileData[]>([]);  // Archivos compartidos del servidor
  const [secretKeyFile, setSecretKeyFile] = useState<File | null>(null);  // El archivo que contiene la secret key
  const [fileId, setFileId] = useState<number | null>(null);  // Solo almacena el id del archivo
  const [signingError, setSigningError] = useState<string>('');  // Errores al firmar
  const [secretKeyError, setSecretKeyError] = useState<string>('');  // Error en la carga de la clave secreta
  const [fileSelectionError, setFileSelectionError] = useState<string>(''); // Error para selección de archivo
  const [token, setToken] = useState<string | null>(null);  // Token de autenticación

  // Usamos useEffect para acceder al token solo en el cliente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);  // Establecer el token en el estado
    } else {
      console.error('No se pudo acceder al token');
    }
  }, []);  // Solo se ejecuta una vez al montar el componente

  // Función para cargar los archivos compartidos desde el servidor
  const loadFiles = useCallback(async () => {
    if (!token) return;  // No cargar archivos si no hay token

    try {
      const response = await axiosInstance.get('/api/files/shared', {
        headers: {
          Authorization: "Bearer " + token  // Agregar el token al encabezado
        }
      });

      console.log('Archivos obtenidos:', response.data);
      if (Array.isArray(response.data)) {
        setFiles(response.data);  // Actualiza el estado de archivos
      } else {
        console.error('La respuesta no es un arreglo:', response.data);
      }
    } catch (error) {
      console.error("Error al cargar los archivos:", error);
    }
  }, [token]);

  // Llamar a loadFiles cuando el token cambie
  useEffect(() => {
    if (token) {
      loadFiles();
    }
  }, [token, loadFiles]);

  // Función para manejar la selección del archivo de la secret key
  const handleSecretKeySelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // Verificamos que el archivo tenga la extensión ".pem"
      const fileExtension = file.name.split('.').pop();
      if (fileExtension?.toLowerCase() === 'pem') {
        setSecretKeyFile(file);  // Si es válido, guardamos el archivo
        setSecretKeyError('');  // Limpiamos el error de tipo de archivo
      } else {
        setSecretKeyFile(null);  // Si no es válido, no lo guardamos
        setSecretKeyError('Por favor, selecciona un archivo con extensión .pem');
      }
    }
  };

  // Función para manejar la firma del archivo
  const handleSignFile = async () => {
    if (!fileId) {
      setSigningError('Por favor selecciona un archivo para firmar.');
      return;
    }
    if (!secretKeyFile) {
      setSigningError('Por favor selecciona un archivo con la clave secreta.');
      return;
    }

    setSigningError(''); // Limpiar errores previos si todo es válido

    try {
      const formData = new FormData();
      formData.append('privateKey', secretKeyFile);

      // Llamar al backend para firmar el archivo, incluyendo el `id` del archivo en la URL como path param
      const response = await axiosInstance.post(`/api/files/${fileId}/sign`, // Usamos el `id` del archivo como path param
        formData, // El archivo secreto se envía como parte del cuerpo
        {
          headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Archivo firmado:', response.data);
      loadFiles();  // Recargar los archivos después de firmar
      router.push("/archivos-compartidos"); // Redirigir después de firmar
    } catch (error) {
      setSigningError('Error al firmar el archivo. Intenta nuevamente.');
      console.error("Error al firmar el archivo:", error);
    }
  };

  // Manejo de la selección de un archivo desde la tabla
  const handleSelectFileFromTable = (file: SharedFileData) => {
    setFileId(file.id);
    setFileSelectionError('');  // Limpiar cualquier error de selección de archivo
    setSigningError('');  // Limpiar el error de firma
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h2 className={styles.title}>Archivos Compartidos</h2>

        {/* Tabla de archivos compartidos */}
        <h3 className={styles.tableTitle}>Archivos Compartidos Disponibles</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Firmas</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}  // Usamos el id del archivo como clave única
                className={fileId === file.id ? styles.selectedRow : ''}  // Resaltar la fila seleccionada
              >
                <td>{file.name}</td>
                <td>
                  {file.signatures.length > 0 ? (
                    <ul>
                      {file.signatures.map((signature, index) => (
                        <li key={index}>
                          <strong>{signature.user}</strong> - {signature.valid ? "✔️" : "❌"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No hay firmas</span>
                  )}
                </td>
                <td>
                  <button
                    className={`${styles.button} ${fileId === file.id ? styles.selectedButton : ''}`} 
                    onClick={() => handleSelectFileFromTable(file)} 
                  >
                    {file.signUser ? 'Ya Firmado' : 'Seleccionar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulario para firmar archivo */}
        <div className={styles.fileButtons}>
          <div className={styles.inputWrapper}>
            <label htmlFor="secretKeyFile" className={styles.inputLabel}>Seleccionar archivo de clave secreta</label>
            <input
              id="secretKeyFile"
              type="file"
              onChange={handleSecretKeySelection}
              className={styles.input}
            />
            {secretKeyError && <p className={styles.error}>{secretKeyError}</p>}
          </div>

          {/* Botón para firmar */}
          <button
            type="button"
            onClick={handleSignFile}
            className={styles.button}
            disabled={!fileId || !secretKeyFile}
          >
            Firmar Archivo
          </button>

          {/* Mostrar errores */}
          {signingError && <p className={styles.error}>{signingError}</p>}
          {fileSelectionError && <p className={styles.error}>{fileSelectionError}</p>}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SharedFileManagerPage;
