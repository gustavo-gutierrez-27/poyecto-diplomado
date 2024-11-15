package app.repository;

import app.model.File;
import app.model.FileSignature;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileSignatureRepository extends JpaRepository<FileSignature, Long> {
    Optional<FileSignature> findByFileAndUser(File file, User user);
}
