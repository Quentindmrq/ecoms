package om.cgi.formation.jhipster.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Game;
import om.cgi.formation.jhipster.ecom.domain.enumeration.ProductType;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Rank;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Region;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "logo")
    private String logo;

    @Column(name = "price")
    private Float price;

    @Enumerated(EnumType.STRING)
    @Column(name = "game")
    private Game game;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type")
    private ProductType productType;

    @Enumerated(EnumType.STRING)
    @Column(name = "region")
    private Region region;

    @Column(name = "account_level")
    private Integer accountLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_rank")
    private Rank accountRank;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_rank")
    private Rank targetRank;

    @JsonIgnoreProperties(value = { "product" }, allowSetters = true)
    @OneToOne(mappedBy = "product")
    private Stock stock;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Product description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogo() {
        return this.logo;
    }

    public Product logo(String logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Float getPrice() {
        return this.price;
    }

    public Product price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Game getGame() {
        return this.game;
    }

    public Product game(Game game) {
        this.game = game;
        return this;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public ProductType getProductType() {
        return this.productType;
    }

    public Product productType(ProductType productType) {
        this.productType = productType;
        return this;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public Region getRegion() {
        return this.region;
    }

    public Product region(Region region) {
        this.region = region;
        return this;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public Integer getAccountLevel() {
        return this.accountLevel;
    }

    public Product accountLevel(Integer accountLevel) {
        this.accountLevel = accountLevel;
        return this;
    }

    public void setAccountLevel(Integer accountLevel) {
        this.accountLevel = accountLevel;
    }

    public Rank getAccountRank() {
        return this.accountRank;
    }

    public Product accountRank(Rank accountRank) {
        this.accountRank = accountRank;
        return this;
    }

    public void setAccountRank(Rank accountRank) {
        this.accountRank = accountRank;
    }

    public Rank getTargetRank() {
        return this.targetRank;
    }

    public Product targetRank(Rank targetRank) {
        this.targetRank = targetRank;
        return this;
    }

    public void setTargetRank(Rank targetRank) {
        this.targetRank = targetRank;
    }

    public Stock getStock() {
        return this.stock;
    }

    public Product stock(Stock stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Stock stock) {
        if (this.stock != null) {
            this.stock.setProduct(null);
        }
        if (stock != null) {
            stock.setProduct(this);
        }
        this.stock = stock;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", logo='" + getLogo() + "'" +
            ", price=" + getPrice() +
            ", game='" + getGame() + "'" +
            ", productType='" + getProductType() + "'" +
            ", region='" + getRegion() + "'" +
            ", accountLevel=" + getAccountLevel() +
            ", accountRank='" + getAccountRank() + "'" +
            ", targetRank='" + getTargetRank() + "'" +
            "}";
    }
}
