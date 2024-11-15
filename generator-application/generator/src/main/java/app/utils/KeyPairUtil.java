package app.utils;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Scanner;

public class KeyPairUtil {

    public static PrivateKey getPrivateKeyFromString(String privateKeyPEM) throws Exception {
        String privateKeyPEMFormatted = privateKeyPEM
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] decoded = Base64.getDecoder().decode(privateKeyPEMFormatted);

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(keySpec);
    }

    public static PublicKey getPublicKeyFromString(String publicKeyPEM) throws Exception {
        String publicKeyPEMFormatted = publicKeyPEM
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] decoded = Base64.getDecoder().decode(publicKeyPEMFormatted);

        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }
    public static PrivateKey getPrivateKeyFromInputStream(InputStream inputStream) throws Exception {
        try (Scanner scanner = new Scanner(inputStream).useDelimiter("\\A")) {
            String privateKeyPEM = scanner.hasNext() ? scanner.next() : "";
            return getPrivateKeyFromString(privateKeyPEM);
        }
    }
    public static boolean verifySignature(byte[] fileData, String signature, String publicKeyStr) throws Exception {
        // Convertir la clave pública de String a PublicKey
        PublicKey publicKey = getPublicKeyFromString(publicKeyStr);

        // Decodificar la firma desde Base64 a bytes
        byte[] signatureBytes = Base64.getDecoder().decode(signature);

        // Configurar el objeto Signature para verificar
        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(publicKey);
        sig.update(fileData);

        // Verificar la firma
        return sig.verify(signatureBytes);
    }

}
