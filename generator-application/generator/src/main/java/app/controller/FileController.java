package app.controller;

import app.dto.FileDto;
import app.model.File;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            User user = userService.findByUsername(username); // Obtener el usuario

            File uploadedFile = fileService.uploadFile(file, user);
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir el archivo");
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<FileDto>> getFilesForSignature(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtils.extractUsername(token);  // Extraemos el nombre de usuario del JWT
        User user = userService.findByUsername(username); // Obtener el usuario
        List<File> files = fileService.getFilesForUser(user);
        List<FileDto> filesDto = new ArrayList<>();
        for (File file : files) {
            filesDto.add(new FileDto(file.getFileName(),file.getFileSignature()));
        }

        return ResponseEntity.ok(filesDto);
    }

    @PostMapping("/{fileId}/sign")
    public ResponseEntity<?> signFile(
            @PathVariable Long fileId,
            @RequestParam String privateKey,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);  // Extraemos el nombre de usuario del JWT
            User user = userService.findByUsername(username); // Obtener el usuario
            // Firma el archivo y valida la firma en el proceso
            File signedFile = fileService.signFile(fileId, privateKey, user);
            return ResponseEntity.ok(signedFile);  // Regresamos el archivo firmado
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al firmar el archivo: " + e.getMessage());
        }
    }
}
