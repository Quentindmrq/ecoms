package om.cgi.formation.jhipster.ecom.repository;

import om.cgi.formation.jhipster.ecom.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
