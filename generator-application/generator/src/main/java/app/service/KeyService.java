package app.service;

import app.model.KeyPair;
import app.model.User;
import app.repository.KeyRepository;
import app.repository.UserRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

@Service
public class KeyService {

    @Autowired
    private KeyRepository keyRepository;

    @Autowired
    private UserRespository userRepository;

    public KeyPair generateKeyPair(String name, User user) throws NoSuchAlgorithmException {
        // Verificar que no exista una llave con el mismo nombre para el usuario
        if (keyRepository.existsByNameAndUser(name, user)) {
            throw new IllegalArgumentException("Ya existe una llave con este nombre para el usuario.");
        }

        // Generar la llave
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        java.security.KeyPair pair = keyGen.generateKeyPair();
        PublicKey publicKey = pair.getPublic();
        PrivateKey privateKey = pair.getPrivate();

        // Crear una nueva KeyPair asociada al usuario
        KeyPair keyPair = new KeyPair();
        keyPair.setName(name);
        keyPair.setPublicKey(Base64.getEncoder().encodeToString(publicKey.getEncoded()));
        keyPair.setPrivateKey(Base64.getEncoder().encodeToString(privateKey.getEncoded()));
        keyPair.setUser(user);  // Asociar la llave al usuario

        return keyRepository.save(keyPair);
    }

    public String getPrivateKey(String name, User user) {
        KeyPair keyPair = keyRepository.findByNameAndUser(name, user);
        return keyPair != null ? keyPair.getPrivateKey() : null;
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
