package app.controller;

import app.config.SecretKey;
import app.config.TokenBlacklist;
import app.model.User;
import app.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.MultiValueMap;
import org.springframework.util.LinkedMultiValueMap;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.random.RandomGenerator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {

    private static final String CLIENT_ID = "877884754903-ad606p0qhcroc4nnnuq1ie55isbkt21o.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";
    private static final String REDIRECT_URI = "http://localhost:80/google";
    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String USER_INFO_URI = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final SecretKey secretKeyInstance = SecretKey.getInstance();
    private final Key SECRET_KEY = secretKeyInstance.getSecretKey();

    RestTemplate restTemplate = new RestTemplate();


    @Autowired
    private UserService userService;

    @GetMapping("/google/login")
    public void redirectToGoogleLogin(HttpServletResponse response) throws IOException {
        String googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + CLIENT_ID +
                "&redirect_uri=" + REDIRECT_URI +
                "&response_type=code" +
                "&scope=email profile";
        response.sendRedirect(googleLoginUrl);
    }

    @GetMapping("/google/callback")
    public ResponseEntity<String> googleCallback(@RequestParam("code") String code) {
        try {
            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();

            System.out.println("Código de autorización: " + code);
            // Intercambiar el código de autorización por un token de acceso
            String accessToken = getAccessTokenFromGoogle(code);

            // Obtener la información del usuario de Google
            Map<String, Object> userInfo = getUserInfoFromGoogle(accessToken);
            String email = (String) userInfo.get("email");
            User user = userService.findByUsername(email);
            if(user == null ){
                user = new User();
                user.setUsername(email);
                String password = random.ints(8, 0, characters.length())  // Genera una secuencia de números aleatorios
                        .mapToObj(i -> String.valueOf(characters.charAt(i)))  // Convierte a caracteres
                        .collect(Collectors.joining());
                user.setPassword(password);
                userService.registerUser(user);
            }


            // Generar un JWT propio para la aplicación
            String jwtToken = Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día
                    .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                    .compact();

            return ResponseEntity.ok(jwtToken);

        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en la autenticación con Google");
        }
    }

    private String getAccessTokenFromGoogle(String code) throws IOException {
        // Crear los parámetros de la solicitud
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", CLIENT_ID);
        params.add("client_secret", CLIENT_SECRET);
        params.add("code", code);
        params.add("redirect_uri", REDIRECT_URI);
        params.add("grant_type", "authorization_code");

        // Crear la solicitud HTTP
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        // Enviar la solicitud POST a TOKEN_URI
        ResponseEntity<Map> response = restTemplate.exchange(TOKEN_URI, HttpMethod.POST, entity, Map.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        } else {
            throw new IOException("Error al obtener el token de acceso de Google");
        }
    }


    private Map<String, Object> getUserInfoFromGoogle(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(USER_INFO_URI, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new RuntimeException("Error al obtener la información del usuario de Google");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User newUser = userService.registerUser(user);
        return ResponseEntity.ok(newUser);
    }

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
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        TokenBlacklist.revokeToken(token);
        return ResponseEntity.ok("ok");
    }

}
