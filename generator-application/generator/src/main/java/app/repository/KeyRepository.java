package app.repository;

import app.model.KeyPair;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeyRepository extends JpaRepository<KeyPair, Long> {
    boolean existsByNameAndUser(String name, User user);
    KeyPair findByNameAndUser(String name, User user);
}
