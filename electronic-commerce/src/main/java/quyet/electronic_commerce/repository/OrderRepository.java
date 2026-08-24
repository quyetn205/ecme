package quyet.electronic_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import quyet.electronic_commerce.entity.Orders;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders,Long> {

    @Query("select o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "where o.user.id =:userId " +
            "order by o.orderDate desc ")
    List<Orders> findAllOrdersByUserIdWithDetails(@Param("userId") Long userId);

    @Query("select o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "order by o.orderDate desc ")
    List<Orders> findAllOrdersWithDetails();

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o")
    Float calculateTotalRevenue();

    @Query("select o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "where o.orderDate >= :startDate " +
            "order by o.orderDate asc")
    List<Orders> findOrdersByOrderDateAfter(@Param("startDate") java.time.LocalDateTime startDate);
}
