package quyet.electronic_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String username;
    String password;
//    @Column(name = "full_name", nullable = false)
    String fullName;
    String phone;
    String email;
    boolean status;
    @Builder.Default
    String authProvider = "LOCAL"; // LOCAL or GOOGLE

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user")
    List<Orders> orders;

    @OneToOne(mappedBy = "user")
    Cart cartUser;
}
