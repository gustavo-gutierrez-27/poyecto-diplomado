package app.repository;

import app.model.File;
import app.model.KeyPair;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByUserId(Long userId);
    Optional<File> findByIdAndUser(Long id, User user);

}
