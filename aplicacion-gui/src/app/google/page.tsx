// pages/google
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Función de "sleep" para simular una espera en milisegundos
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndRedirect = async () => {
      // Obtener el código de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          // Hacer una solicitud al backend para intercambiar el código por un token JWT
          const response = await fetch(`http://localhost:8080/api/google/callback?code=${code}`);

          if (!response.ok) {
            throw new Error("Error al obtener el token de Google");
          }

          const token = await response.text(); // El backend devolverá el token como texto

          // Almacenar el token JWT en localStorage
          localStorage.setItem("token", token);

          // Esperar 2 segundos antes de redirigir (simula un retraso opcional)
          await sleep(2000);

          // Redirigir al usuario a la página de inicio o dashboard
          router.push("/inicio");  // O a la página que desees
        } catch (error) {
          console.error("Error al obtener el token de Google:", error);
          // Aquí puedes redirigir a una página de error o mostrar un mensaje
        }
      } else {
        // Si no hay código, redirige o muestra un mensaje de error
        console.error("No se recibió el código de Google");
        // Redirigir o mostrar mensaje de error
      }
    };

    fetchTokenAndRedirect(); // Llamar a la función asíncrona

  }, [router]); // Este efecto se ejecuta solo una vez al cargar el componente

  return (
    <div>
      <p>Autenticando...</p>
    </div>
  );
};

export default GoogleCallback;
