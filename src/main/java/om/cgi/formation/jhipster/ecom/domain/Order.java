package om.cgi.formation.jhipster.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "purchased")
    private int purchased;

    @Column(name = "purchase_date")
    private ZonedDateTime purchaseDate;

    @Column(name = "purchase_price")
    private Float purchasePrice;

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.REMOVE })
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    private Set<OrderLine> orderLines = new HashSet<>();

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.REMOVE })
    private Address billingAddress;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "firstName", "lastName", "email", "activated", "langKey", "imageUrl", "resetDate" },
        allowSetters = true
    )
    private User owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order id(Long id) {
        this.id = id;
        return this;
    }

    public int getPurchased() {
        return this.purchased;
    }

    public Order purchased(int purchased) {
        this.purchased = purchased;
        return this;
    }

    public void setPurchased(int purchased) {
        this.purchased = purchased;
    }

    public ZonedDateTime getPurchaseDate() {
        return this.purchaseDate;
    }

    public Order purchaseDate(ZonedDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
        return this;
    }

    public void setPurchaseDate(ZonedDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Float getPurchasePrice() {
        return this.purchasePrice;
    }

    public Order purchasePrice(Float purchasePrice) {
        this.purchasePrice = purchasePrice;
        return this;
    }

    public void setPurchasePrice(Float purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Set<OrderLine> getOrderLines() {
        return this.orderLines;
    }

    public Order orderLines(Set<OrderLine> orderLines) {
        this.setOrderLines(orderLines);
        return this;
    }

    public Order addOrderLines(OrderLine orderLine) {
        this.orderLines.add(orderLine);
        orderLine.setOrder(this);
        return this;
    }

    public Order removeOrderLines(OrderLine orderLine) {
        this.orderLines.remove(orderLine);
        orderLine.setOrder(null);
        return this;
    }

    public void setOrderLines(Set<OrderLine> orderLines) {
        if (this.orderLines != null) {
            this.orderLines.forEach(i -> i.setOrder(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setOrder(this));
        }
        this.orderLines = orderLines;
    }

    public Address getBillingAddress() {
        return this.billingAddress;
    }

    public Order billingAddress(Address address) {
        this.setBillingAddress(address);
        return this;
    }

    public void setBillingAddress(Address address) {
        this.billingAddress = address;
    }

    public User getOwner() {
        return this.owner;
    }

    public Order owner(User user) {
        this.setOwner(user);
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public void removeOrderLinebyId(long id) {
        for (OrderLine ol : this.orderLines) {
            if (ol.getId() == id) {
                this.orderLines.remove(ol);
                return;
            }
        }
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", purchased='" + getPurchased() + "'" +
            ", purchaseDate='" + getPurchaseDate() + "'" +
            ", purchasePrice=" + getPurchasePrice() +
            "}";
    }
}
