package app.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String username;

    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KeyPair> keyPairs = new ArrayList<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> ownedFiles = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileSignature> fileSignatures = new ArrayList<>();

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public List<KeyPair> getKeyPairs() {
        return keyPairs;
    }

    public void setKeyPairs(List<KeyPair> keyPairs) {
        this.keyPairs = keyPairs;
    }

    public void addKeyPair(KeyPair keyPair) {
        keyPairs.add(keyPair);
        keyPair.setUser(this);
    }

    public void removeKeyPair(KeyPair keyPair) {
        keyPairs.remove(keyPair);
        keyPair.setUser(null);
    }

    public List<File> getOwnedFiles() {
        return ownedFiles;
    }

    public void setOwnedFiles(List<File> ownedFiles) {
        this.ownedFiles = ownedFiles;
    }

    public void addOwnedFile(File file) {
        ownedFiles.add(file);
        file.setOwner(this);
    }

    public void removeOwnedFile(File file) {
        ownedFiles.remove(file);
        file.setOwner(null);
    }

    public List<FileSignature> getFileSignatures() {
        return fileSignatures;
    }

    public void setFileSignatures(List<FileSignature> fileSignatures) {
        this.fileSignatures = fileSignatures;
    }
}
