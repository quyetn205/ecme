package quyet.electronic_commerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String fullName;
    String phoneNumber;
    String address;
    LocalDateTime orderDate;
    Float totalPrice;
    String status;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    List<OrderItem> orderItems;

    @ManyToOne
    User user;
}
