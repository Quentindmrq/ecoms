package om.cgi.formation.jhipster.ecom.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import om.cgi.formation.jhipster.ecom.IntegrationTest;
import om.cgi.formation.jhipster.ecom.domain.ContactDetails;
import om.cgi.formation.jhipster.ecom.repository.ContactDetailsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ContactDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContactDetailsResourceIT {

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/contact-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ContactDetailsRepository contactDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContactDetailsMockMvc;

    private ContactDetails contactDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactDetails createEntity(EntityManager em) {
        ContactDetails contactDetails = new ContactDetails().phoneNumber(DEFAULT_PHONE_NUMBER);
        return contactDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactDetails createUpdatedEntity(EntityManager em) {
        ContactDetails contactDetails = new ContactDetails().phoneNumber(UPDATED_PHONE_NUMBER);
        return contactDetails;
    }

    @BeforeEach
    public void initTest() {
        contactDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createContactDetails() throws Exception {
        int databaseSizeBeforeCreate = contactDetailsRepository.findAll().size();
        // Create the ContactDetails
        restContactDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isCreated());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        ContactDetails testContactDetails = contactDetailsList.get(contactDetailsList.size() - 1);
        assertThat(testContactDetails.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void createContactDetailsWithExistingId() throws Exception {
        // Create the ContactDetails with an existing ID
        contactDetails.setId(1L);

        int databaseSizeBeforeCreate = contactDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContactDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllContactDetails() throws Exception {
        // Initialize the database
        contactDetailsRepository.saveAndFlush(contactDetails);

        // Get all the contactDetailsList
        restContactDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contactDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)));
    }

    @Test
    @Transactional
    void getContactDetails() throws Exception {
        // Initialize the database
        contactDetailsRepository.saveAndFlush(contactDetails);

        // Get the contactDetails
        restContactDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, contactDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contactDetails.getId().intValue()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingContactDetails() throws Exception {
        // Get the contactDetails
        restContactDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewContactDetails() throws Exception {
        // Initialize the database
        contactDetailsRepository.saveAndFlush(contactDetails);

        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();

        // Update the contactDetails
        ContactDetails updatedContactDetails = contactDetailsRepository.findById(contactDetails.getId()).get();
        // Disconnect from session so that the updates on updatedContactDetails are not directly saved in db
        em.detach(updatedContactDetails);
        updatedContactDetails.phoneNumber(UPDATED_PHONE_NUMBER);

        restContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedContactDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
        ContactDetails testContactDetails = contactDetailsList.get(contactDetailsList.size() - 1);
        assertThat(testContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();
        contactDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contactDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();
        contactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();
        contactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contactDetails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContactDetailsWithPatch() throws Exception {
        // Initialize the database
        contactDetailsRepository.saveAndFlush(contactDetails);

        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();

        // Update the contactDetails using partial update
        ContactDetails partialUpdatedContactDetails = new ContactDetails();
        partialUpdatedContactDetails.setId(contactDetails.getId());

        partialUpdatedContactDetails.phoneNumber(UPDATED_PHONE_NUMBER);

        restContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
        ContactDetails testContactDetails = contactDetailsList.get(contactDetailsList.size() - 1);
        assertThat(testContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateContactDetailsWithPatch() throws Exception {
        // Initialize the database
        contactDetailsRepository.saveAndFlush(contactDetails);

        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();

        // Update the contactDetails using partial update
        ContactDetails partialUpdatedContactDetails = new ContactDetails();
        partialUpdatedContactDetails.setId(contactDetails.getId());

        partialUpdatedContactDetails.phoneNumber(UPDATED_PHONE_NUMBER);

        restContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
        ContactDetails testContactDetails = contactDetailsList.get(contactDetailsList.size() - 1);
        assertThat(testContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();
        contactDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();
        contactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = contactDetailsRepository.findAll().size();
        contactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(contactDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContactDetails in the database
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContactDetails() throws Exception {
        // Initialize the database
        contactDetailsRepository.saveAndFlush(contactDetails);

        int databaseSizeBeforeDelete = contactDetailsRepository.findAll().size();

        // Delete the contactDetails
        restContactDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, contactDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ContactDetails> contactDetailsList = contactDetailsRepository.findAll();
        assertThat(contactDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
