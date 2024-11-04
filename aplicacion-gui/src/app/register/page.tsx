"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './styles.module.css';
import axiosInstance from '@/axiosConfig';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

const RegisterPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar email
    return re.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

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
      const response = await axiosInstance.post('/api/register', {
        email,
        password,
      });

      if (response.status === 200) {
        // Redirigir al usuario después del registro exitoso
        router.push('/login'); // Cambia a la ruta a la que quieras redirigir
      } else {
        setErrorMessage('Error al registrarse. Inténtalo de nuevo.'); // Mensaje para otro código de estado
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; // Casting a AxiosError
      setErrorMessage(axiosError.response?.data.message || 'Error al registrarse. Inténtalo de nuevo.');
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
