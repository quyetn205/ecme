package quyet.electronic_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import quyet.electronic_commerce.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Modifying
    @Query(value = "DELETE from user_roles where roles_name=:roleName",nativeQuery = true)
    void removeRoleLinks(String roleName);
    
    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
