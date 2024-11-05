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

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axiosInstance.post('/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data);
        router.push('/inicio');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setErrorMessage(axiosError.response?.data.message || 'Correo o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <label className={styles.label}>Correo:</label>
        <input
          type="email"
          value={email}
          placeholder="Ingresa tu correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <label className={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={password}
          placeholder="Ingresa tu contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>
      <p>
        ¿No tienes una cuenta? <Link href="/register" className={styles.link}>Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default LoginPage;
