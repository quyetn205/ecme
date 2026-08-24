package quyet.electronic_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import quyet.electronic_commerce.entity.Permission;
import quyet.electronic_commerce.entity.Role;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission,String> {

}
