"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importa el componente Link
import styles from './styles.module.css'; // Importa el archivo CSS Module
import axiosInstance from '@/axiosConfig';

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
        // Guardar el token en el almacenamiento local (o donde prefieras)
        localStorage.setItem('token', response.data.token);

        // Redirigir al usuario después del inicio de sesión exitoso
        router.push('/inicio'); // Cambia a la ruta a la que quieras redirigir
      }
    } catch (error) {
      setErrorMessage('Correo o contraseña incorrectos');
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
