package quyet.electronic_commerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import quyet.electronic_commerce.entity.Category;
import quyet.electronic_commerce.entity.Product;
import org.springframework.data.jpa.repository.Modifying;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    boolean existsByName(String name);
    Product deleteProductById(Long id);
    boolean existsByCategory(Category category);
    
    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :quantity WHERE p.id = :productId AND p.stockQuantity >= :quantity")
    int decrementStock(@Param("productId") Long productId, @Param("quantity") int quantity);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity + :quantity WHERE p.id = :productId")
    int incrementStock(@Param("productId") Long productId, @Param("quantity") int quantity);

    @Query("SELECT p FROM Product p WHERE " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findWithFilters(@Param("keyword") String keyword,
                                  @Param("categoryId") Long categoryId,
                                  @Param("minPrice") Float minPrice,
                                  @Param("maxPrice") Float maxPrice,
                                  Pageable pageable);
}
