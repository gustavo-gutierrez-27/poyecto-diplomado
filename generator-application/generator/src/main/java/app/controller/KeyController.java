package app.controller;

import app.model.KeyPair;
import app.service.KeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/keys")
@CrossOrigin(origins = {"http://localhost:3000"}) // Cambia la URL según tu frontend
public class KeyController {
    @Autowired
    private KeyService keyService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateKey(@RequestParam String name) {
        try {
            KeyPair keyPair = keyService.generateKeyPair(name);
            String responseKey = formatPrivateKey(keyPair.getPrivateKey());
            return ResponseEntity.ok(responseKey);
        } catch ( NoSuchAlgorithmException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/private")
    public ResponseEntity<String> getPrivateKey(@RequestParam String name) {
        String privateKey = keyService.getPrivateKey(name);
        return privateKey != null ? ResponseEntity.ok(privateKey) : ResponseEntity.notFound().build();
    }
    private String formatPrivateKey(String privateKey) {
        StringBuilder sb = new StringBuilder();

        // Añadir el encabezado
        sb.append("-----BEGIN PRIVATE KEY-----\n");

        // Añadir el contenido de la llave, con un formato adecuado
        String base64Key = privateKey.replaceAll("\\s+", ""); // Eliminar espacios en blanco
        for (int i = 0; i < base64Key.length(); i += 64) {
            sb.append(base64Key, i, Math.min(i + 64, base64Key.length())).append("\n");
        }

        // Añadir el pie
        sb.append("-----END PRIVATE KEY-----");

        return sb.toString();
    }
}
