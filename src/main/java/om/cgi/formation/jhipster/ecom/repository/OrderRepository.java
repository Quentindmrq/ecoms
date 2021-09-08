package om.cgi.formation.jhipster.ecom.repository;

import java.util.List;
import om.cgi.formation.jhipster.ecom.domain.Order;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select jhiOrder from Order jhiOrder where jhiOrder.owner.login = ?#{principal.username}")
    List<Order> findByOwnerIsCurrentUser();
}
