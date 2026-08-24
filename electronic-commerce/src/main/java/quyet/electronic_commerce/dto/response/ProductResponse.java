package quyet.electronic_commerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse implements Serializable {
    Long id;
    String name;
    String description;
    Float price;
    Integer quantity;
    String image;
    CategoryResponse category;
    Float averageRating;
    Integer reviewCount;
}
