package om.cgi.formation.jhipster.ecom.repository;

import java.util.List;
import java.util.Optional;
import javax.persistence.LockModeType;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Game;
import om.cgi.formation.jhipster.ecom.domain.enumeration.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Stock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    //@Query("select jhiOrder from Order jhiOrder where jhiOrder.owner.login = ?#{principal.username} and jhiOrder.id = ?1")

    @Query("select jhistock from Stock jhistock where stock.product.game = ?1 and stock.product.productType = ?2")
    Page<Stock> findallbygameandtype(Game game, ProductType type, Pageable pageable);

    @Query("select jhistock from Stock jhistock where stock.product.game = ?1")
    Page<Stock> findallbygame(Game game, Pageable pageable);

    @Query("select jhistock from Stock jhistock where stock.product.productType = ?1")
    Page<Stock> findallbytype(ProductType type, Pageable pageable);

    Page<Stock> findAll(Pageable pageable);
}
