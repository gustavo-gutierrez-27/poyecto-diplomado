"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import Image from "next/image"; // Importamos Image de Next.js

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      if (response.status === 200) {
        // Aquí obtenemos el token como texto, ya que el backend lo devuelve en un string
        const token = await response.text(); // Usamos .text() para obtener el token

        // Guardamos el token en el localStorage
        localStorage.setItem("token", token);

        // Redirigimos a la página de inicio
        router.push("/inicio");
      } else {
        // Si la respuesta no es 200, tratamos de obtener el mensaje de error
        const errorData = await response.json(); // Esto sigue funcionando para obtener errores en formato JSON
        setErrorMessage(errorData.message || "Correo o contraseña incorrectos");
      }
    } catch (error: unknown) {
      // Verificamos si 'error' tiene la propiedad 'message'
      if (error instanceof Error) {
        console.error(error.message); // Logueamos el mensaje del error
        setErrorMessage(
          error.message || "Error al intentar iniciar sesión. Intenta nuevamente."
        );
      } else {
        // Si el error no es un objeto Error tradicional, muestra un error genérico
        setErrorMessage("Error al intentar iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirige al backend para manejar la autenticación con Google
    window.location.href = "http://localhost:8080/api/login/google"; // Asegúrate que esta ruta esté configurada en tu backend
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
        {/* Mostrar el spinner si estamos en el estado de carga */}
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? (
            <div className={styles.spinner}></div> // El spinner se muestra mientras estamos cargando
          ) : (
            "Iniciar Sesión"
          )}
        </button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>

      {/* Botón para Google Login */}
      <button className={styles.googleButton} onClick={handleGoogleLogin}>
        <Image
          src="/img/logoGoogle.png" // Ruta de la imagen (asegúrate que esté en public/img)
          alt="Google Logo"
          className={styles.googleLogo}
          width={24} // Establece el tamaño de la imagen
          height={24}
        />
        Continuar con Google
      </button>

      <p>
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
