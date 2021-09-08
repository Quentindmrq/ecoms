package om.cgi.formation.jhipster.ecom.repository;

import java.util.List;
import om.cgi.formation.jhipster.ecom.domain.ContactDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ContactDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactDetailsRepository extends JpaRepository<ContactDetails, Long> {
    //@Query("select * from contactDeltails where jhiOrder.owner.login = ?#{principal.username} and jhiOrder.id = ?1")
    //List<ContactDetails> findOneIsCurrentUser();
}
