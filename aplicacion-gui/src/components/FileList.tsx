"use client"; // Asegúrate de que este archivo sea un componente de cliente

import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/axiosConfig';

interface FileData {
  id: number;
  name: string;
  signed: string;
  valid: boolean;
}

interface FileListProps {
  onFileSelect: (file: FileData) => void;
  token: string;
}

const FileList: React.FC<FileListProps> = ({ onFileSelect, token }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);  // Estado para el archivo seleccionado

  // Cargar los archivos desde la API
  const loadFiles = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axiosInstance.get('/api/files/available', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Archivos obtenidos:', response.data); // Verifica la respuesta
      if (Array.isArray(response.data)) {
        setFiles(response.data);
      } else {
        console.error('La respuesta no es un arreglo:', response.data);
      }
    } catch (error) {
      console.error("Error al cargar los archivos:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadFiles();
    }
  }, [loadFiles, token]);

  // Función para manejar la selección del archivo
  const handleFileClick = (file: FileData) => {
    setSelectedFileId(file.id); // Establecer el archivo seleccionado
    onFileSelect(file);  // Pasar el archivo seleccionado al padre
  };

  return (
    <div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${selectedFileId === file.id ? 'selected' : ''}`} // Agregar clase 'selected' si el archivo está seleccionado
            onClick={() => handleFileClick(file)}
          >
            <div className="file-icon">📄</div>
            <p>{file.name}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .file-list {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 20px;
          margin-bottom: 20px;
          scroll-snap-type: x mandatory; /* Permite el desplazamiento por sección */
        }

        .file-item {
          cursor: pointer;
          text-align: center;
          width: 120px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          transition: all 0.3s ease; /* Transición suave para cambios */
          scroll-snap-align: start; /* Alineación de los elementos cuando se hace scroll */
        }

        .file-item:hover {
          background-color: #f0f0f0;
          transform: scale(1.05); /* Pequeña ampliación al pasar el ratón */
        }

        .file-item.selected {
          background-color: #007bff; /* Fondo azul cuando el archivo está seleccionado */
          color: white; /* Cambiar el color del texto */
          border-color: #0056b3; /* Borde azul */
        }

        .file-icon {
          font-size: 40px;
        }

        .file-item p {
          margin-top: 10px;
          font-size: 14px;
          color: #333;
        }

        .message-section {
          margin-top: 20px;
        }

        .message-section label {
          display: block;
          margin-bottom: 5px;
        }

        .message-section input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default FileList;
