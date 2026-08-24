package quyet.electronic_commerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Long id;
    LocalDateTime orderDate;
    String status;
    Float totalPrice;

    String fullName;
    String phoneNumber;
    String address;

    List<OrderItemResponse> items;
}
