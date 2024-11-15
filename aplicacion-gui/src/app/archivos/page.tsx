"use client";

import { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import axiosInstance from '@/axiosConfig';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute'; // Asegúrate de que la ruta sea correcta

// Definimos una interfaz para los archivos que ya están en el servidor (Archivos cargados)
interface FileData {
  id: number;
  name: string;
  signatures: { user: string; valid: boolean }[]; // Cambié la estructura de firmas
}

const FileManagerPage = () => {
  const router = useRouter();
  const [files, setFiles] = useState<FileData[]>([]);  // Archivos del servidor
  const [dataFile, setDataFile] = useState<File | null>(null);  // El archivo seleccionado para firmar
  const [secretKeyFile, setSecretKeyFile] = useState<File | null>(null);  // El archivo que contiene la secret key
  const [fileId, setFileId] = useState<number | null>(null);  // Solo almacena el id del archivo
  const [uploadError, setUploadError] = useState<string>('');  // Errores de carga
  const [token, setToken] = useState<string | null>(null);  // Token de autenticación
  const [signingError, setSigningError] = useState<string>('');  // Errores al firmar
  const [secretKeyError, setSecretKeyError] = useState<string>('');  // Error en la carga de la clave secreta
  const [fileSelectionError, setFileSelectionError] = useState<string>(''); // Error para selección de archivo

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
  const loadFiles = useCallback(async () => {
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
  }, [token]);

  // Llamar a loadFiles cuando el token cambie
  useEffect(() => {
    if (token) {
      loadFiles();
    }
  }, [token, loadFiles]);

  // Función para manejar la carga del archivo
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevenir el comportamiento predeterminado del formulario

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

      setDataFile(null);  // Limpiar el archivo seleccionado
      const uploadedFile = response.data;
      setFiles((prevFiles) => [...prevFiles, uploadedFile]);  // Agregar el archivo cargado a la lista
      loadFiles();
      router.push("/archivos");  // Redirigir a la página de archivos
      setUploadError('');  // Limpiar el mensaje de error

    } catch (error) {
      setUploadError('Error al cargar el archivo. Intenta nuevamente.');
      console.error("Error al cargar el archivo:", error);
    }
  };

  // Función para manejar la selección del archivo
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setDataFile(file);  // Guarda el archivo seleccionado para cargar
    setFileSelectionError('');  // Limpiar cualquier mensaje de error
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
      loadFiles();
      router.push("/archivos")
    } catch (error) {
      setSigningError('Error al firmar el archivo. Intenta nuevamente.');
      console.error("Error al firmar el archivo:", error);
    }
  };

  // Manejo de la selección de un archivo desde la tabla
  const handleSelectFileFromTable = (file: FileData) => {
    setFileId(file.id);
    setFileSelectionError('');  // Limpiar cualquier error de selección de archivo
    setSigningError('');  // Limpiar el error de firma
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h2 className={styles.title}>Gestión de Archivos</h2>

        {/* Tabla de archivos */}
        <h3 className={styles.tableTitle}>Archivos Disponibles</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Firma</th>
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
                  {/* Mostrar todas las firmas */}
                  {file.signatures.length > 0 ? (
                    file.signatures.map((signature, index) => (
                      <div key={index} className={styles.signature}>
                        {signature.user} {signature.valid ? '✔️' : '❌'}
                      </div>
                    ))
                  ) : (
                    <span>No firmado</span>
                  )}
                </td>
                <td>
                  <button
                    className={`${styles.button} ${fileId === file.id ? styles.selectedButton : ''}`}  // Cambiar estilo del botón seleccionado
                    onClick={() => handleSelectFileFromTable(file)}  // Al hacer clic, seleccionamos el archivo
                    disabled={file.signatures.length > 0}  // Deshabilitar el botón si el archivo está firmado
                  >
                    {file.signatures.length > 0 ? 'Firmado' : 'Seleccionar'}
                  </button>
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
          <form
            onSubmit={async (e) => {
              e.preventDefault();  // Prevenir el comportamiento por defecto de envío del formulario
              console.log("Formulario de firma enviado");
              await handleSignFile();  // Llamar a la función de firma
            }}
            className={styles.form}  // Agregar clases según sea necesario
          >
            <button
              type="button"  // Usamos "button" para evitar enviar un formulario
              onClick={handleSignFile}  // Al hacer clic, llamamos a la función para firmar el archivo
              className={fileId && secretKeyFile ? styles.button : styles.buttonDisabled}  // Aplica el estilo del botón habilitado o deshabilitado
              disabled={!fileId || !secretKeyFile}  // Deshabilita el botón si no se cumple la condición
            >
              Firmar Archivo
            </button>
          </form>
        </div>

        {/* Mostrar errores */}
        {uploadError && <p className={styles.error}>{uploadError}</p>}
        {signingError && <p className={styles.error}>{signingError}</p>}
        {fileSelectionError && <p className={styles.error}>{fileSelectionError}</p>}
      </div>
    </ProtectedRoute>
  );
};

export default FileManagerPage;
