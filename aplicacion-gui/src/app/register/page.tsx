"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importa el componente Link
import styles from './styles.module.css'; // Importa el archivo CSS Module

const RegisterPage = () => {
  const [name, setName] = useState<string>(''); // Nuevo estado para el nombre
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Expresión regular para validar que el nombre solo contenga letras y números
  const validateInput = (value: string): boolean => {
    const regex = /^[a-zA-Z0-9]+$/; // Permite solo letras y números
    return regex.test(value);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar email
    return re.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Validar el nombre
    if (!validateInput(name)) {
      setErrorMessage('Por favor, usa solo letras y números para el nombre.');
      setIsLoading(false);
      return;
    }

    // Validar el email
    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setIsLoading(false);
      return;
    }

    // Validar las contraseñas
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        name, // Incluye el nombre en la solicitud
        email,
        password,
      });

      if (response.status === 200) {
        // Redirigir al usuario después del registro exitoso
        router.push('/login'); // Cambia a la ruta a la que quieras redirigir
      }
    } catch (error) {
      setErrorMessage('Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <label className={styles.label}>Correo:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <label className={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <label className={styles.label}>Confirmar Contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
        {/* Mantén el espacio reservado para el mensaje de error */}
        <p className={styles.error} style={{ minHeight: '20px' }}>
          {errorMessage}
        </p>
      </form>
      <p>
        ¿Ya tienes cuenta? 
        <Link href="/login" className={styles.link}> Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
