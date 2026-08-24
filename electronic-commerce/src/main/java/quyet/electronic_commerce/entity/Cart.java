package quyet.electronic_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String status;

    @OneToMany(mappedBy = "cart")
    List<CartItem> items;

    @OneToOne
    @JoinColumn(name = "user_id",unique = true)
    User user;
}
