package om.cgi.formation.jhipster.ecom.repository;

import java.util.List;
import java.util.Optional;
import om.cgi.formation.jhipster.ecom.domain.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("select jhiOrder from Order jhiOrder where jhiOrder.owner.login = ?#{principal.username}")
    Page<Order> findByOwnerIsCurrentUser(Pageable pagerequested);

    @Query("select jhiOrder from Order jhiOrder where jhiOrder.owner.login = ?#{principal.username} and jhiOrder.purchased = 0")
    Optional<Order> findOneByOwnerIsCurrentUserAndPurchasedIsFalse();

    @Query("select jhiOrder from Order jhiOrder where jhiOrder.owner.login = ?#{principal.username} and jhiOrder.id = ?1")
    Optional<Order> findOneByIdIfOwnerIsCurrentUser(long id);

    Optional<Order> findOneById(long id);

    @Query("select jhiOrder from Order jhiOrder where jhiOrder.purchased = 0")
    List<Order> findAllByPurchasedIsFalse();

    Page<Order> findAll(Pageable pageRequested);
}
