package app.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class SecretKey {

    // Variable privada estática para la única instancia
    private static SecretKey instance;

    // La clave secreta generada una sola vez
    private final Key SECRET_KEY;

    // Constructor privado para evitar la creación directa de instancias fuera de esta clase
    private SecretKey() {
        // Generación de la clave secreta usando HMAC con el algoritmo HS256
        this.SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    // Método público para obtener la instancia única de la clase
    public static SecretKey getInstance() {
        // Comprobación de inicialización con sincronización para manejar posibles problemas en entornos multi-hilo
        if (instance == null) {
            synchronized (SecretKey.class) {
                if (instance == null) {
                    instance = new SecretKey();
                }
            }
        }
        return instance;
    }

    // Método para obtener la clave secreta
    public Key getSecretKey() {
        return SECRET_KEY;
    }
}
