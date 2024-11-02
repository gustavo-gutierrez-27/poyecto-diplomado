package app.repository;

import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRespository extends JpaRepository<User, Long> {
    User findByUsername(String username);

}
