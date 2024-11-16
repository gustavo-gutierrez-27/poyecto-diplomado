// pages/google
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    // Obtener el código de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Hacer una solicitud al backend para intercambiar el código por un token JWT
      fetch(`http://localhost:8080/api/google/callback?code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener el token de Google");
          }
          return response.text(); // El backend devolverá el token como texto
        })
        .then((token) => {
          // Almacenar el token JWT en localStorage
          localStorage.setItem("token", token);

          // Redirigir al usuario a la página de inicio o dashboard
          router.push("/inicio");  // O a la página que desees
        })
        .catch((error) => {
          console.error("Error al obtener el token de Google:", error);
          // Aquí puedes redirigir a una página de error o mostrar un mensaje
        });
    } else {
      // Si no hay código, redirige o muestra un mensaje de error
      console.error("No se recibió el código de Google");
      // Redirigir o mostrar mensaje de error
    }
  }, [router]);

  return (
    <div>
      <p>Autenticando...</p>
    </div>
  );
};

export default GoogleCallback;
