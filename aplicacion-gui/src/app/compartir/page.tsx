"use client"; // Asegúrate de que este archivo sea un componente de cliente

import React, { useState, useEffect, useRef } from 'react';
import FileList from '../../components/FileList'; // Importa el componente FileList
import './autocomplete.css'; // Asegúrate de que los estilos estén bien definidos en este archivo
import ProtectedRoute from '@/components/ProtectedRoute'; // Asegúrate de que la ruta sea correcta
import axiosInstance from '@/axiosConfig';

// Tipos para los archivos
interface FileData {
  id: number;
  name: string;
  signed: string;
  valid: boolean;
}

// Tipos para los usuarios (según lo que devuelve tu backend)
interface User {
  id: number;
  username: string;
}

const SharePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [message, setMessage] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  // Para el autocompletado de usuarios
  const [users, setUsers] = useState<User[]>([]); // Todos los usuarios cargados del backend
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Usuarios filtrados según la búsqueda
  const [query, setQuery] = useState<string>(''); // Valor del input de búsqueda
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado
  const [suggestionsPosition, setSuggestionsPosition] = useState<'top' | 'bottom'>('bottom'); // Control de la posición de las sugerencias

  const inputRef = useRef<HTMLInputElement | null>(null); // Para obtener la referencia del input de búsqueda
  const suggestionsRef = useRef<HTMLUListElement | null>(null); // Para las sugerencias

  // Obtener el token desde el almacenamiento local
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }
  }, []);

  // Función para obtener los usuarios del backend solo una vez
  useEffect(() => {

    const token = localStorage.getItem('token'); // Obtener el token desde el almacenamiento local
    if (!token) {
      console.error('Token no encontrado'); // Si no se encuentra el token, mostrar un mensaje de error
      return;
    }

    axiosInstance
      .get('api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`, // Pasar el token como Authorization header
        },
      }) // URL del backend
      .then((response) => {
        // Verificar que la respuesta es un array
        console.error("response: " + response);
        if (Array.isArray(response.data)) {
          setUsers(response.data); // Guardamos todos los usuarios del backend
          setFilteredUsers(response.data); // Inicializamos el filtro con todos los usuarios
        } else {
          console.error('La respuesta no es un arreglo:', response.data);
          setUsers([]); // Si no es un array, aseguramos que `users` sea un array vacío
          setFilteredUsers([]); // Igualmente para `filteredUsers`
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Función para manejar la búsqueda de usuarios
  useEffect(() => {
    if (query.length > 2) { // Solo filtrar si hay más de 2 caracteres
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]); // Limpiar los resultados si la búsqueda tiene menos de 3 caracteres
    }

    // Ajustar la posición de las sugerencias
    if (inputRef.current && suggestionsRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom; // Espacio disponible debajo del input
      if (spaceBelow < 200) {
        setSuggestionsPosition('top'); // Si no hay suficiente espacio, poner las sugerencias arriba
      } else {
        setSuggestionsPosition('bottom'); // Si hay espacio, poner las sugerencias abajo
      }
    }
  }, [query, users]);

  const handleFileSelect = (file: FileData) => {
    setSelectedFile(file);
    setMessage('');
  };

  // Manejar selección de usuario
  const handleUserSelect = (user: User) => {
    setSelectedUser(user); // Guardar el usuario seleccionado
    setQuery(user.username); // Rellenar el campo con el username del usuario seleccionado
    setFilteredUsers([]); // Limpiar las sugerencias
  };

  // Función para compartir el archivo
  const handleShare = async () => {
    // Validar que se haya seleccionado un archivo y un usuario
    if (!selectedFile || !selectedUser) {
      setMessage('Por favor, selecciona un archivo y un usuario antes de compartir.');
      return;
    }

    // Obtener el token de autorización desde el almacenamiento local (o donde lo almacenes)
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No se ha encontrado un token de autenticación.');
      return;
    }

    try {
      // Realizar la solicitud POST al backend para compartir el archivo
      await axiosInstance.post(
        `/api/files/${selectedFile.id}/share`, // Endpoint para compartir el archivo
        null, // No es necesario enviar el cuerpo de la solicitud
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pasar el token de autorización
          },
          params: {
            userId: selectedUser.id, // Enviar el userId como parámetro de consulta
          },
        }
      );

      // Lógica para manejar la respuesta
      setMessage(`Archivo "${selectedFile.name}" compartido exitosamente con ${selectedUser.username}!`);
      setSelectedFile(null);
      setSelectedUser(null);
      setQuery('');
    } catch (error) {
      // Manejo de errores si algo sale mal
      console.error('Error al compartir el archivo:', error);
      setMessage('Error al compartir el archivo. Intenta nuevamente.');
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h1>Compartir Archivos</h1>
        <p>Selecciona un archivo para compartir.</p>

        {token ? (
          <FileList onFileSelect={handleFileSelect} token={token} />
        ) : (
          <p>Por favor, inicia sesión para ver tus archivos.</p>
        )}

        {selectedFile && (
          <h2>Archivo Seleccionado: {selectedFile.name}</h2>
        )}

        {/* Campo de autocompletado para seleccionar un usuario */}
        <div style={{ position: 'relative' }}>
          <label htmlFor="user-search">Buscar Usuario</label>
          <input
            ref={inputRef}
            id="user-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Actualizamos el valor de la consulta
            placeholder="Buscar usuario..."
          />

          {/* Mostrar las sugerencias si hay usuarios */}
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 && (
            <ul
              ref={suggestionsRef}
              className={`autocomplete-suggestions ${suggestionsPosition}`}
              style={{
                display: filteredUsers.length > 0 ? 'block' : 'none',
                position: 'absolute',
                top: '78%', // Colocamos las sugerencias justo debajo del input
                left: 0,
                right: 0,
                zIndex: 10, // Asegura que las sugerencias se superpongan
                marginTop: '0.25rem', // Espacio pequeño entre el input y las sugerencias
              }}
            >
              {filteredUsers.map((user) => (
                <li key={user.id} onClick={() => handleUserSelect(user)}>
                  {user.username} {/* Mostrar el username del usuario */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedUser && (
          <h3>Usuario Seleccionado: {selectedUser.username}</h3>
        )}

        {/* Mensaje de error o éxito */}
        {message && <p>{message}</p>}

        {/* Botón para compartir */}
        <button onClick={handleShare} disabled={!selectedFile || !selectedUser}>
          Compartir
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default SharePage;
