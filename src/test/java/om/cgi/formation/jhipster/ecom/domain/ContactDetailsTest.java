package om.cgi.formation.jhipster.ecom.domain;

import static org.assertj.core.api.Assertions.assertThat;

import om.cgi.formation.jhipster.ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContactDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContactDetails.class);
        ContactDetails contactDetails1 = new ContactDetails();
        contactDetails1.setId(1L);
        ContactDetails contactDetails2 = new ContactDetails();
        contactDetails2.setId(contactDetails1.getId());
        assertThat(contactDetails1).isEqualTo(contactDetails2);
        contactDetails2.setId(2L);
        assertThat(contactDetails1).isNotEqualTo(contactDetails2);
        contactDetails1.setId(null);
        assertThat(contactDetails1).isNotEqualTo(contactDetails2);
    }
}
