package app.repository;

import app.model.KeyPair;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeyRepository extends JpaRepository<KeyPair, Long> {
    KeyPair findByName(String name);
}
