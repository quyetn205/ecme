package quyet.electronic_commerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardSummaryResponse implements Serializable {
    Long totalUsers;
    Long totalProducts;
    Long totalOrders;
    Float totalRevenue;
}
