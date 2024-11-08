package app.controller;

import app.model.KeyPair;
import app.model.User;
import app.service.KeyService;
import app.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/keys")
public class KeyController {
    @Autowired
    private KeyService keyService;

    @Autowired
    private JwtUtils jwtUtils;  // Servicio para extraer el usuario desde el JWT

    @PostMapping("/generate")
    public ResponseEntity<String> generateKey(@RequestParam String name, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.extractUsername(token);  // Extraemos el nombre de usuario del JWT
        User user = keyService.findUserByUsername(username); // Obtener el usuario

        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        try {
            KeyPair keyPair = keyService.generateKeyPair(name, user);  // Generar la clave asociada al usuario
            String responseKey = formatPrivateKey(keyPair.getPrivateKey());
            return ResponseEntity.ok(responseKey);
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.badRequest().body("Error generando las llaves");
        }
    }

    @GetMapping("/private")
    public ResponseEntity<String> getPrivateKey(@RequestParam String name, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.extractUsername(token);  // Extraemos el nombre de usuario del JWT
        User user = keyService.findUserByUsername(username); // Obtener el usuario

        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        String privateKey = keyService.getPrivateKey(name, user);  // Buscar la llave asociada al usuario
        return privateKey != null ? ResponseEntity.ok(privateKey) : ResponseEntity.notFound().build();
    }

    private String formatPrivateKey(String privateKey) {
        StringBuilder sb = new StringBuilder();

        sb.append("-----BEGIN PRIVATE KEY-----\n");
        String base64Key = privateKey.replaceAll("\\s+", "");
        for (int i = 0; i < base64Key.length(); i += 64) {
            sb.append(base64Key, i, Math.min(i + 64, base64Key.length())).append("\n");
        }
        sb.append("-----END PRIVATE KEY-----");

        return sb.toString();
    }
}
