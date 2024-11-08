package app.utils;

import app.config.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtUtils {

    // Obtener la instancia única de SecretKey
    SecretKey secretKeyInstance = SecretKey.getInstance();

    // Obtener la clave secreta
    Key SECRET_KEY = secretKeyInstance.getSecretKey();

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
