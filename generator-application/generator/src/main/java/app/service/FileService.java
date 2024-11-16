package app.service;

import app.dto.FileDto;
import app.model.File;
import app.model.FileSignature;
import app.model.User;
import app.repository.FileRepository;
import app.repository.FileSignatureRepository;
import app.repository.KeyRepository;
import app.repository.UserRespository;
import app.utils.KeyPairUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private KeyRepository keyPairRepository;

    @Autowired
    private UserRespository userRespository;

    @Autowired
    private FileSignatureRepository fileSignatureRepository;

    public File uploadFile(MultipartFile file, User owner) throws NoSuchAlgorithmException, IOException {
        File newFile = new File();
        newFile.setFileName(file.getOriginalFilename());
        newFile.setFileData(file.getBytes());
        newFile.setOwner(owner);

        // Calcular el hash del archivo
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(file.getBytes());
        newFile.setFileHash(Base64.getEncoder().encodeToString(hash));

        return fileRepository.save(newFile);
    }

    public List<File> getFilesForUser(User user) {
        return fileRepository.findByOwnerId(user.getId());
    }

    public FileSignature signFile(Long fileId, MultipartFile privateKeyFile, User user) throws Exception {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("Archivo no encontrado"));

        // Leer la clave privada desde el archivo
        PrivateKey privateKey;
        try (InputStream privateKeyInputStream = privateKeyFile.getInputStream()) {
            privateKey = KeyPairUtil.getPrivateKeyFromInputStream(privateKeyInputStream);
        }

        // Generar la firma con la clave privada
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(file.getFileData());
        byte[] digitalSignature = signature.sign();

        // Crear una nueva instancia de FileSignature
        FileSignature fileSignature = new FileSignature();
        fileSignature.setFile(file);
        fileSignature.setUser(user);
        fileSignature.setSignature(Base64.getEncoder().encodeToString(digitalSignature));
        fileSignature.setSignedAt(LocalDateTime.now());

        // Guardar la firma en la base de datos
        return fileSignatureRepository.save(fileSignature);
    }

    public boolean verifyFileSignature(Long fileId, User user) throws Exception {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("Archivo no encontrado"));

        // Obtener la firma correspondiente al usuario
        FileSignature fileSignature = fileSignatureRepository.findByFileAndUser(file, user)
                .orElseThrow(() -> new IllegalStateException("El archivo no tiene una firma asociada para este usuario"));

        // Verificar la firma con la clave pública
        Signature signature = Signature.getInstance("SHA256withRSA");
        PublicKey publicKey = KeyPairUtil.getPublicKeyFromString(user.getKeyPairs().get(0).getPublicKey());
        signature.initVerify(publicKey);
        signature.update(file.getFileData());

        byte[] digitalSignature = Base64.getDecoder().decode(fileSignature.getSignature());
        return signature.verify(digitalSignature);
    }


    public List<FileDto> getAvailableFilesWithSignatures(User user) {
        List<FileDto> fileDtos = new ArrayList<>();

        // Solo archivos propios
        List<File> userFiles = fileRepository.findByOwnerId(user.getId());

        // Convertir los archivos propios a FileDto
        for (File file : userFiles) {
            FileDto fileDto = buildFileDto(file);
            fileDtos.add(fileDto);
        }

        return fileDtos;
    }

    public List<FileDto> getSharedFiles(User user) {
        List<FileDto> fileDtos = new ArrayList<>();

        // Obtener los archivos compartidos con el usuario
        List<File> sharedFiles = fileRepository.findFilesSharedWithUser(user.getId());

        // Convertir los archivos compartidos a FileDto
        for (File file : sharedFiles) {
            FileDto fileDto = buildFileDto(file);
            fileDtos.add(fileDto);
        }

        return fileDtos;
    }



    // Método para compartir un archivo con otro usuario
    public File shareFileWithUser(Long fileId, Long userIdToShareWith, User owner) {
        // Buscar el archivo y verificar que pertenece al usuario actual
        File file = fileRepository.findByIdAndOwner(fileId, owner)
                .orElseThrow(() -> new IllegalArgumentException("Archivo no encontrado o no autorizado para compartir."));

        // Obtener el usuario con el cual se compartirá el archivo
        User userToShareWith = userRespository.findById(userIdToShareWith)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        // Agregar el usuario a la lista de usuarios con los que está compartido
        file.addSharedUser(userToShareWith);

        // Guardar el archivo con la actualización
        return fileRepository.save(file);
    }

    private FileDto buildFileDto(File file) {
        List<Map<String, Object>> signaturesInfo = new ArrayList<>();

        for (FileSignature fileSignature : file.getSignatures()) {
            Map<String, Object> signatureInfo = new HashMap<>();
            signatureInfo.put("user", fileSignature.getUser().getUsername());
            signatureInfo.put("valid", verifySignature(file, fileSignature)); // Método para verificar la validez
            signaturesInfo.add(signatureInfo);
        }

        return new FileDto(
                file.getId(),
                file.getFileName(),
                signaturesInfo
        );
    }

    private boolean verifySignature(File file, FileSignature fileSignature) {
        try {
            return KeyPairUtil.verifySignature(
                    file.getFileData(),
                    fileSignature.getSignature(),
                    fileSignature.getUser().getKeyPairs().get(0).getPublicKey()  // Suponiendo que tienes la clave pública del usuario en `User`
            );
        } catch (Exception e) {
            return false;
        }
    }
}
