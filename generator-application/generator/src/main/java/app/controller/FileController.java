package app.controller;

import app.model.File;
import app.model.User;
import app.service.FileService;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User userRequest) {
        try {

            User user = userService.findByUsername(userRequest.getUsername());

            File uploadedFile = fileService.uploadFile(file, user);
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir el archivo");
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<File>> getFilesForSignature(@AuthenticationPrincipal User userRequest) {
        User user = userService.findByUsername(userRequest.getUsername());
        List<File> files = fileService.getFilesForUser(user);
        return ResponseEntity.ok(files);
    }

    @PostMapping("/{fileId}/sign")
    public ResponseEntity<?> signFile(
            @PathVariable Long fileId,
            @RequestParam String privateKey,
            @AuthenticationPrincipal User userRequest) {
        try {
            User user = userService.findByUsername(userRequest.getUsername());
            // Firma el archivo y valida la firma en el proceso
            File signedFile = fileService.signFile(fileId, privateKey, user);
            return ResponseEntity.ok(signedFile);  // Regresamos el archivo firmado
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al firmar el archivo: " + e.getMessage());
        }
    }
}
