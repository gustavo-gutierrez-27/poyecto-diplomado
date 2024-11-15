package app.repository;

import app.model.File;
import app.model.KeyPair;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByOwnerId(Long userId);
    Optional<File> findByIdAndUser(Long id, User user);

    // Buscar archivos que se compartieron con un usuario específico
    @Query("SELECT f FROM File f JOIN f.sharedWithUsers u WHERE u.id = :userId")
    List<File> findFilesSharedWithUser(@Param("userId") Long userId);

}
