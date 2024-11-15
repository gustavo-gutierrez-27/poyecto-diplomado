package app.controller;

import app.dto.FileDto;
import app.model.File;
import app.model.FileSignature;
import app.model.User;
import app.service.FileService;
import app.service.UserService;
import app.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private JwtUtils jwtUtils;  // Servicio para extraer el usuario desde el JWT

    @Autowired
    private FileService fileService;

    @Autowired
    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);  // Extraemos el nombre de usuario del JWT
            User owner = userService.findByUsername(username); // Obtener el usuario propietario

            File uploadedFile = fileService.uploadFile(file, owner);  // Cambia 'user' a 'owner'
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir el archivo");
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableFilesWithSignatures(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);
            User user = userService.findByUsername(username);

            List<FileDto> files = fileService.getAvailableFilesWithSignatures(user);

            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    // Endpoint para compartir un archivo con otro usuario
    @PostMapping("/{fileId}/share")
    public ResponseEntity<?> shareFileWithUser(
            @PathVariable Long fileId,
            @RequestParam Long userId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Obtener el usuario actual desde el JWT
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);
            User owner = userService.findByUsername(username);

            // Compartir el archivo
            File sharedFile = fileService.shareFileWithUser(fileId, userId, owner);
            return ResponseEntity.ok("Archivo compartido exitosamente con el usuario.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al compartir el archivo: " + e.getMessage());
        }
    }


    @PostMapping("/{fileId}/sign")
    public ResponseEntity<?> signFile(
            @PathVariable Long fileId,
            @RequestParam("privateKey") MultipartFile privateKey,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);  // Extraemos el nombre de usuario del JWT
            User user = userService.findByUsername(username); // Obtener el usuario
            // Firma el archivo y valida la firma en el proceso
            FileSignature signedFile = fileService.signFile(fileId, privateKey, user);
            return ResponseEntity.ok(signedFile);  // Regresamos el archivo firmado
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Error al firmar el archivo: " + e.getMessage()));
        }
    }

    @GetMapping("/{fileId}/verify")
    public ResponseEntity<?> verifyFileSignature(
            @PathVariable Long fileId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);
            User user = userService.findByUsername(username); // Obtener el usuario

            boolean isValid = fileService.verifyFileSignature(fileId, user);
            return ResponseEntity.ok(Collections.singletonMap("isValid", isValid));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
