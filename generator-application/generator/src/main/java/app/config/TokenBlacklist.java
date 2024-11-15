package app.config;

import java.util.HashSet;
import java.util.Set;

public class TokenBlacklist {
    // En una implementación real, esto debería estar en una base de datos
    private static Set<String> revokedTokens = new HashSet<>();

    // Método para agregar un token a la lista negra
    public static void revokeToken(String token) {
        revokedTokens.add(token);
    }

    // Método para verificar si un token está revocado
    public static boolean isTokenRevoked(String token) {
        return revokedTokens.contains(token);
    }
}
