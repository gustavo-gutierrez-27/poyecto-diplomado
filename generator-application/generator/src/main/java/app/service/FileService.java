package app.service;

import app.model.File;
import app.model.User;
import app.repository.FileRepository;
import app.repository.KeyRepository;
import app.utils.KeyPairUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.util.Base64;
import java.util.List;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private KeyRepository keyPairRepository;

    public File uploadFile(MultipartFile file, User user) throws NoSuchAlgorithmException, IOException {
        File newFile = new File();
        newFile.setFileName(file.getOriginalFilename());
        newFile.setFileData(file.getBytes());
        newFile.setUser(user);

        // Calcular el hash del archivo
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(file.getBytes());
        newFile.setFileHash(Base64.getEncoder().encodeToString(hash));

        return fileRepository.save(newFile);
    }

    public List<File> getFilesForUser(User user) {
        return fileRepository.findByUserId(user.getId());
    }

    public File signFile(Long fileId, MultipartFile privateKeyFile, User user) throws Exception {
        File file = fileRepository.findByIdAndUser(fileId, user)
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
        file.setFileSignature(Base64.getEncoder().encodeToString(digitalSignature));

        // Verificar la firma generada inmediatamente después de firmar
        //boolean isValid = verifyFileSignature(fileId, user);


        return fileRepository.save(file);
    }


    public boolean verifyFileSignature(Long fileId, User user) throws Exception {
        File file = fileRepository.findByIdAndUser(fileId, user).orElseThrow(() -> new IllegalArgumentException("Archivo no encontrado"));

        if (file.getFileSignature() == null) {
            throw new IllegalStateException("El archivo no tiene una firma asociada");
        }

        // Verificar la firma con la clave pública
        Signature signature = Signature.getInstance("SHA256withRSA");
        PublicKey publicKey = KeyPairUtil.getPublicKeyFromString(user.getKeyPairs().get(0).getPublicKey());
        signature.initVerify(publicKey);
        signature.update(file.getFileData());

        byte[] digitalSignature = Base64.getDecoder().decode(file.getFileSignature());
        return signature.verify(digitalSignature);
    }


}
