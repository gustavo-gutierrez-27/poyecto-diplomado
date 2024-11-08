"use client";

import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import axiosInstance from '@/axiosConfig';
import ProtectedRoute from '@/components/ProtectedRoute';

// Definimos una interfaz para los archivos que ya están en el servidor (Archivos cargados)
interface FileData {
  id: string;
  name: string;
  uploadedAt: string;
}

const FileManagerPage = () => {
  const [files, setFiles] = useState<FileData[]>([]);  // Archivos del servidor
  const [dataFile, setDataFile] = useState<File | null>(null);  // El archivo seleccionado
  const [secretKeyFile, setSecretKeyFile] = useState<File | null>(null);  // El archivo que contiene la secret key
  const [uploadError, setUploadError] = useState<string>('');  // Errores de carga
  const [token, setToken] = useState<string | null>(null);  // Token de autenticación
  const [signingError, setSigningError] = useState<string>('');  // Errores al firmar
  const [secretKeyError, setSecretKeyError] = useState<string>('');  // Error en la carga de la clave secreta

  // Usamos useEffect para acceder al token solo en el cliente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);  // Establecer el token en el estado
    } else {
      console.error('No se pudo acceder al token');
    }
  }, []);  // Solo se ejecuta una vez al montar el componente

  // Función para cargar los archivos desde el servidor
  const loadFiles = async () => {
    if (!token) return;  // No cargar archivos si no hay token

    try {
      const response = await axiosInstance.get('/api/files/available', {
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
  };

  // Función para manejar la carga del archivo
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataFile) {
      setUploadError('Por favor selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', dataFile);

    try {
      const response = await axiosInstance.post('/api/files/upload', formData, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFile = response.data;
      setFiles((prevFiles) => [...prevFiles, uploadedFile]);  // Agregar el archivo cargado a la lista
      loadFiles();  // Recargar la lista de archivos
      setUploadError('');  // Limpiar errores
    } catch (error) {
      setUploadError('Error al cargar el archivo. Intenta nuevamente.');
      console.error("Error al cargar el archivo:", error);
    }
  };

  // Función para manejar la selección del archivo
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setDataFile(file);  // Guarda el archivo seleccionado
  };

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
    if (!dataFile || !secretKeyFile) {
      setSigningError('Por favor selecciona un archivo y un archivo con la clave secreta.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', dataFile);
      formData.append('secretKey', secretKeyFile);

      // Llamar al backend para firmar el archivo
      const response = await axiosInstance.post('/api/files/sign', formData, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Archivo firmado:', response.data);
      setSigningError('');  // Limpiar errores de firma
      loadFiles();  // Recargar la lista de archivos
    } catch (error) {
      setSigningError('Error al firmar el archivo. Intenta nuevamente.');
      console.error("Error al firmar el archivo:", error);
    }
  };

  useEffect(() => {
    // Solo cargar los archivos si hay un token disponible
    if (token) {
      loadFiles();
    }
  }, [token]);  // Ejecutar nuevamente si el token cambia

  return (
      <div className={styles.container}>
        <h2 className={styles.title}>Gestión de Archivos</h2>

        {/* Tabla de archivos */}
        <h3 className={styles.tableTitle}>Archivos Disponibles</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de Subida</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{file.uploadedAt}</td>
                <td>
                  <button className={styles.button}>Seleccionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulario para cargar archivo */}
        <div className={styles.fileButtons}>
          <form onSubmit={handleUpload} className={styles.form}>
            <div className={styles.fileInputWrapper}>
              <label htmlFor="dataFile" className={styles.inputLabel}>Agregar archivo</label>
              <input
                id="dataFile"
                type="file"
                onChange={handleFileSelection}
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={dataFile ? styles.button : styles.buttonDisabled}
              disabled={!dataFile}
            >
              Cargar Archivo
            </button>
          </form>

          {/* Campo para cargar el archivo que contiene la clave secreta */}
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

          {/* Botón para firmar el archivo */}
          <button
            type="button"
            onClick={handleSignFile}
            className={styles.button}
            disabled={!secretKeyFile || !dataFile}
          >
            Firmar Archivo
          </button>
        </div>

        {uploadError && <p className={styles.error}>{uploadError}</p>}
        {signingError && <p className={styles.error}>{signingError}</p>}
      </div>
  );
};

export default FileManagerPage;
