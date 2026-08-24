package quyet.electronic_commerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Category {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   Long id;

   String name;
   String description;

   @JsonIgnore
   @OneToMany(mappedBy = "category")
   List<Product> products;
}
