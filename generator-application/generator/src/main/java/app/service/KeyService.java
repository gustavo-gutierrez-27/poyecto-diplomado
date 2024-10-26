package app.service;

import app.model.KeyPair;
import app.repository.KeyRepository;
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

    public KeyPair generateKeyPair(String name) throws NoSuchAlgorithmException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        java.security.KeyPair pair = keyGen.generateKeyPair();
        PublicKey publicKey = pair.getPublic();
        PrivateKey privateKey = pair.getPrivate();

        KeyPair keyPair = new KeyPair();
        keyPair.setName(name);
        keyPair.setPublicKey(Base64.getEncoder().encodeToString(publicKey.getEncoded()));
        keyPair.setPrivateKey(Base64.getEncoder().encodeToString(privateKey.getEncoded()));

        return keyRepository.save(keyPair);
    }

    public String getPrivateKey(String name) {
        KeyPair keyPair = keyRepository.findByName(name);
        return keyPair != null ? keyPair.getPrivateKey() : null;
    }
}
