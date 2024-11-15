const express = require('express');
const cors = require('cors'); // Importa el paquete CORS

const app = express();
const port = 3001;

// Configuración de CORS: Permitir solicitudes desde cualquier origen (ajusta si es necesario)
app.use(cors()); // Habilita CORS globalmente para todas las rutas

// Endpoint que retorna un JSON con usuarios
app.get('/usuarios', (req, res) => {
    const usuarios = [
        { "id": 1, "username": "juan@ejemplo.com" },
        { "id": 2, "username": "ana@ejemplo.com" },
        { "id": 3, "username": "pedro@ejemplo.com" },
        { "id": 4, "username": "juan1@ejemplo.com" },
        { "id": 5, "username": "ana1@ejemplo.com" },
        { "id": 6, "username": "pedro123@ejemplo.com" },
        { "id": 7, "username": "juanito@ejemplo.com" },
        { "id": 8, "username": "ana123@ejemplo.com" },
        { "id": 9, "username": "pedro_987@ejemplo.com" },
        { "id": 10, "username": "juan2020@ejemplo.com" },
        { "id": 11, "username": "ana2020@ejemplo.com" },
        { "id": 12, "username": "pedro_2020@ejemplo.com" },
        { "id": 13, "username": "juanito_1@ejemplo.com" },
        { "id": 14, "username": "ana_1@ejemplo.com" },
        { "id": 15, "username": "pedro_1@ejemplo.com" },
        { "id": 16, "username": "juan_a@ejemplo.com" },
        { "id": 17, "username": "ana_b@ejemplo.com" },
        { "id": 18, "username": "pedro_c@ejemplo.com" },
        { "id": 19, "username": "juan_example@ejemplo.com" },
        { "id": 20, "username": "ana_example@ejemplo.com" },
        { "id": 21, "username": "pedro_example@ejemplo.com" },
        { "id": 22, "username": "juan.ex@ejemplo.com" },
        { "id": 23, "username": "ana.ex@ejemplo.com" },
        { "id": 24, "username": "pedro.ex@ejemplo.com" },
        { "id": 25, "username": "juan.ejemplo@ejemplo.com" },
        { "id": 26, "username": "ana.ejemplo@ejemplo.com" },
        { "id": 27, "username": "pedro.ejemplo@ejemplo.com" },
        { "id": 28, "username": "juan1234@ejemplo.com" },
        { "id": 29, "username": "ana1234@ejemplo.com" },
        { "id": 30, "username": "pedro1234@ejemplo.com" }
    ];

    res.json(usuarios);  // Responde con el JSON de usuarios
});

// Endpoint que retorna un JSON con usuarios
app.get('/available', (req, res) => {
    const usuarios = [
        {
            "id": 1,
            "name": "archivo3.png",
            "signed": "firmado",
            "valid": false
        },
        {
            "id": 2,
            "name": "archivo1.docx",
            "signed": "firmado",
            "valid": true
        },
        {
            "id": 52,
            "name": "generate_jwt.py",
            "signed": "firmado",
            "valid": true
        }
    ];

    res.json(usuarios);  // Responde con el JSON de usuarios
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
