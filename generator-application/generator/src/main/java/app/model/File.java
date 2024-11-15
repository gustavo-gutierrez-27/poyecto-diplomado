package app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Entity
@Getter
@Setter
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fileName;

    @Lob
    private byte[] fileData;

    @Column(columnDefinition = "TEXT")
    private String fileHash;

    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileSignature> signatures = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(
            name = "file_shared_users",
            joinColumns = @JoinColumn(name = "file_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> sharedWithUsers = new HashSet<>();

    // Getters y setters
    public Set<User> getSharedWithUsers() {
        return sharedWithUsers;
    }

    public void setSharedWithUsers(Set<User> sharedWithUsers) {
        this.sharedWithUsers = sharedWithUsers;
    }

    public void addSharedUser(User user) {
        sharedWithUsers.add(user);
    }

    public void removeSharedUser(User user) {
        sharedWithUsers.remove(user);
    }


    public void addSignature(FileSignature signature) {
        signature.setFile(this);
        this.signatures.add(signature);
    }



    // Método para representar el archivo como base64, útil para la comunicación con el frontend
    public String getFileDataAsBase64() {
        return Base64.getEncoder().encodeToString(this.fileData);
    }


}
