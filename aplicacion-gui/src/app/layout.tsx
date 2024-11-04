// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import Header from '../components/header'; // Asegúrate de que la ruta sea correcta
import Footer from '../components/footer'; // Asegúrate de que la ruta sea correcta
import { AuthProvider } from '../context/AuthContext'; // Ajusta la ruta según tu estructura

const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Generator Key",
  description: "Generated Keys pair",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider> {/* Envuelve el contenido en AuthProvider */}
          <Header /> {/* Agrega el Header aquí */}
          <main>{children}</main>
          <Footer /> {/* Agrega el Footer aquí */}
        </AuthProvider>
      </body>
    </html>
  );
}
