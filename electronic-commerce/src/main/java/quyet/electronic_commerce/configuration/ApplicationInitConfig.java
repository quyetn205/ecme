package quyet.electronic_commerce.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import quyet.electronic_commerce.entity.Role;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.enums.RoleEnum;
import quyet.electronic_commerce.repository.RoleRepository;
import quyet.electronic_commerce.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driver-class-name",
            havingValue = "com.mysql.cj.jdbc.Driver"
    )
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        log.info("Init application....");
        return args -> {
            // 1. Tạo Role USER nếu chưa có
            if(!roleRepository.existsById(RoleEnum.USER.name())){
                roleRepository.save(Role.builder()
                        .name(RoleEnum.USER.name())
                        .description("user role")
                        .build());
                log.info("Role has been created");
            }

            if(!roleRepository.existsById(RoleEnum.EMPLOYEE.name())){
                roleRepository.save(Role.builder()
                        .name(RoleEnum.EMPLOYEE.name())
                        .description("employee role")
                        .build());
                log.info("Role EMPLOYEE has been created");
            }

            if(userRepository.findByUsername("admin").isEmpty()){

                // 2. Tạo Role ADMIN nếu chưa có
                Role adminRole= roleRepository.findById(RoleEnum.ADMIN.name())
                        .orElseGet(()->roleRepository.save(Role.builder()
                                .name((RoleEnum.ADMIN.name()))
                                .description("admin role")
                                .build()));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User user= User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .status(true)
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password admin,please change it");
            }
        };
    }
}
