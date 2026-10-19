package quyet.electronic_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import quyet.electronic_commerce.entity.Orders;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders,Long> {

    @Query("select distinct o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "where o.user.id =:userId " +
            "order by o.orderDate desc ")
    List<Orders> findAllOrdersByUserIdWithDetails(@Param("userId") Long userId);

    @Query("select distinct o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "order by o.orderDate desc ")
    List<Orders> findAllOrdersWithDetails();

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o WHERE o.status IN ('DELIVERED', 'COMPLETED')")
    Float calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o WHERE o.status IN ('DELIVERED', 'COMPLETED') AND o.orderDate >= :startDate AND o.orderDate <= :endDate")
    Float calculateTotalRevenueBetween(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate);

    @Query("select distinct o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "where o.orderDate >= :startDate " +
            "order by o.orderDate asc")
    List<Orders> findOrdersByOrderDateAfter(@Param("startDate") java.time.LocalDateTime startDate);

    @Query("select distinct o from Orders o " +
            "left join fetch o.orderItems oi " +
            "left join fetch oi.product " +
            "where o.orderDate >= :startDate and o.orderDate <= :endDate " +
            "order by o.orderDate asc")
    List<Orders> findOrdersByOrderDateBetween(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate);

    long countByOrderDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
