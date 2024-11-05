package app.controller;

import app.config.SecretKey;
import app.model.User;
import app.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User newUser = userService.registerUser(user);
        return ResponseEntity.ok(newUser);
    }

    // Obtener la instancia única de SecretKey
    app.config.SecretKey secretKeyInstance = SecretKey.getInstance();

    // Obtener la clave secreta
    Key SECRET_KEY = secretKeyInstance.getSecretKey();

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        User foundUser = userService.findByUsername(user.getUsername());
        if (foundUser != null && userService.getPasswordEncoder().matches(user.getPassword(), foundUser.getPassword())) {
            String token = Jwts.builder()
                    .setSubject(foundUser.getUsername())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día
                    .signWith(SECRET_KEY) // Usa la clave generada
                    .compact();
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Credenciales inválidas");
    }
}
