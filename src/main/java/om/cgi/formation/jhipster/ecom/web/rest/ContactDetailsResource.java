package om.cgi.formation.jhipster.ecom.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import om.cgi.formation.jhipster.ecom.domain.ContactDetails;
import om.cgi.formation.jhipster.ecom.repository.ContactDetailsRepository;
import om.cgi.formation.jhipster.ecom.security.AuthoritiesConstants;
import om.cgi.formation.jhipster.ecom.service.UserService;
import om.cgi.formation.jhipster.ecom.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link om.cgi.formation.jhipster.ecom.domain.ContactDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContactDetailsResource {

    private final Logger log = LoggerFactory.getLogger(ContactDetailsResource.class);

    private static final String ENTITY_NAME = "contactDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final ContactDetailsRepository contactDetailsRepository;

    public ContactDetailsResource(ContactDetailsRepository contactDetailsRepository, UserService userService) {
        this.contactDetailsRepository = contactDetailsRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /contact-details} : Create a new contactDetails.
     *
     * @param contactDetails the contactDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contactDetails, or with status {@code 400 (Bad Request)} if the contactDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contact-details")
    public ResponseEntity<ContactDetails> createContactDetails(@RequestBody ContactDetails contactDetails) throws URISyntaxException {
        log.debug("REST request to save ContactDetails : {}", contactDetails);
        if (contactDetails.getId() != null) {
            throw new BadRequestAlertException("A new contactDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ContactDetails result = contactDetailsRepository.save(contactDetails);
        return ResponseEntity
            .created(new URI("/api/contact-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contact-details/:id} : Updates an existing contactDetails.
     *
     * @param id the id of the contactDetails to save.
     * @param contactDetails the contactDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactDetails,
     * or with status {@code 400 (Bad Request)} if the contactDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contactDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contact-details/{id}")
    public ResponseEntity<ContactDetails> updateContactDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ContactDetails contactDetails
    ) throws URISyntaxException {
        log.debug("REST request to update ContactDetails : {}, {}", id, contactDetails);
        if (contactDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contactDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ContactDetails result = contactDetailsRepository.save(contactDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contact-details/:id} : Partial updates given fields of an existing contactDetails, field will ignore if it is null
     *
     * @param id the id of the contactDetails to save.
     * @param contactDetails the contactDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactDetails,
     * or with status {@code 400 (Bad Request)} if the contactDetails is not valid,
     * or with status {@code 404 (Not Found)} if the contactDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the contactDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contact-details/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ContactDetails> partialUpdateContactDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ContactDetails contactDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update ContactDetails partially : {}, {}", id, contactDetails);
        if (contactDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contactDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ContactDetails> result = contactDetailsRepository
            .findById(contactDetails.getId())
            .map(
                existingContactDetails -> {
                    if (contactDetails.getPhoneNumber() != null) {
                        existingContactDetails.setPhoneNumber(contactDetails.getPhoneNumber());
                    }

                    return existingContactDetails;
                }
            )
            .map(contactDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /contact-details} : get all the contactDetails.
     *  Only an admin can get all the contatc details
     *  A user will only get his if it exist
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contactDetails in body.
     */
    @GetMapping("/contact-details")
    public List<ContactDetails> getAllContactDetails() {
        log.debug("REST request to get all ContactDetails");
        List<String> auth = userService.getAuthorities();
        if (auth.contains(AuthoritiesConstants.ADMIN)) {
            return contactDetailsRepository.findAll();
        }
        /*if(auth.contains(AuthoritiesConstants.USER)){
            return contactDetailsRepository.findOneIsCurrentUser();
        }*/
        return null;
    }

    /**
     * {@code GET  /contact-details/:id} : get the "id" contactDetails.
     *
     * @param id the id of the contactDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contactDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contact-details/{id}")
    public ResponseEntity<ContactDetails> getContactDetails(@PathVariable Long id) {
        log.debug("REST request to get ContactDetails : {}", id);
        Optional<ContactDetails> contactDetails = contactDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(contactDetails);
    }

    /**
     * {@code DELETE  /contact-details/:id} : delete the "id" contactDetails.
     *
     * @param id the id of the contactDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contact-details/{id}")
    public ResponseEntity<Void> deleteContactDetails(@PathVariable Long id) {
        log.debug("REST request to delete ContactDetails : {}", id);
        contactDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
