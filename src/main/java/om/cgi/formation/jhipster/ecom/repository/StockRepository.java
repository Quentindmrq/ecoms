package om.cgi.formation.jhipster.ecom.repository;

import java.util.List;
import java.util.Optional;
import javax.persistence.LockModeType;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Stock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {}
