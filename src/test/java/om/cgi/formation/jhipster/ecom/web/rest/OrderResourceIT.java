package om.cgi.formation.jhipster.ecom.web.rest;

import static om.cgi.formation.jhipster.ecom.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import om.cgi.formation.jhipster.ecom.IntegrationTest;
import om.cgi.formation.jhipster.ecom.domain.Order;
import om.cgi.formation.jhipster.ecom.domain.OrderLine;
import om.cgi.formation.jhipster.ecom.domain.Product;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import om.cgi.formation.jhipster.ecom.domain.User;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Game;
import om.cgi.formation.jhipster.ecom.domain.enumeration.ProductType;
import om.cgi.formation.jhipster.ecom.repository.OrderLineRepository;
import om.cgi.formation.jhipster.ecom.repository.OrderRepository;
import om.cgi.formation.jhipster.ecom.repository.ProductRepository;
import om.cgi.formation.jhipster.ecom.repository.StockRepository;
import om.cgi.formation.jhipster.ecom.security.AuthoritiesConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderResourceIT {

    private static final Integer DEFAULT_STOCK = 10000;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";

    private static final String DEFAULT_LOGO = "AAAAAAAAAA";

    private static final Float DEFAULT_PRICE = 1F;

    private static final Game DEFAULT_GAME = Game.LEAGUE_OF_LEGENDS;

    private static final ProductType DEFAULT_PRODUCT_TYPE = ProductType.GAME_ACCOUNT;

    private static final ZonedDateTime DEFAULT_PURCHASE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PURCHASE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_LINES_API_URL = "/api/order-lines";

    private static final Integer DEFAULT_QUANTITY = 1;

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderLineRepository orderLineRepository;

    @Autowired
    private ProductRepository ProdRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderMockMvc;

    private Order order;

    private OrderLine orderLine;

    private Product prod;

    private Stock stock;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Order createEntity(EntityManager em) {
        Order order = new Order().purchaseDate(DEFAULT_PURCHASE_DATE).orderLines(new HashSet<OrderLine>());
        order.setPurchased(0);
        order.setPurchasePrice(null);

        return order;
    }

    public static Stock createEntityStock(EntityManager em) {
        Stock stock = new Stock().stock(DEFAULT_STOCK);
        return stock;
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderLine createEntityOl(EntityManager em) {
        OrderLine orderLine = new OrderLine().quantity(DEFAULT_QUANTITY);
        return orderLine;
    }

    public static Product createEntityProd(EntityManager em) {
        Product product = new Product()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .logo(DEFAULT_LOGO)
            .price(DEFAULT_PRICE)
            .game(DEFAULT_GAME)
            .productType(DEFAULT_PRODUCT_TYPE);

        return product;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Order createUpdatedEntity(EntityManager em) {
        Order order = new Order().purchaseDate(UPDATED_PURCHASE_DATE);
        return order;
    }

    @BeforeEach
    public void initTest() {
        order = createEntity(em);
        orderLine = createEntityOl(em);
        prod = createEntityProd(em);
        stock = createEntityStock(em);
        ProdRepository.save(prod);
        stockRepository.save(stock);
    }

    @Test
    @Transactional
    void createOrder() throws Exception {
        User usr = new User();
        usr.setLogin("user");
        order.setOwner(usr);

        int databaseSizeBeforeCreate = orderRepository.findAll().size();
        // Create the Order
        restOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate + 1);
    }

    @Test
    @Transactional
    void create2Order() throws Exception {
        User usr = new User();
        usr.setLogin("user");
        order.setOwner(usr);

        int databaseSizeBeforeCreate = orderRepository.findAll().size();
        // Create the Order
        restOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated());

        // Create the Order
        restOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate + 1);
    }

    @Test
    @Transactional
    void createOrderAndOrderLine() throws Exception {
        User usr = new User();
        usr.setLogin("user");
        order.setOwner(usr);

        orderLine.setProduct(prod);
        prod.setStock(stock);
        stock.setProduct(prod);

        // Create the Order
        MvcResult result = restOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated())
            .andReturn();

        String content = result.getResponse().getContentAsString();
        String before = "\"purchaseDate\":";
        String after = ",\"purchasePrice\"";
        String newcontent =
            content.substring(0, content.indexOf(before) + before.length()) + "null" + content.substring(content.indexOf(after));
        Order createdOrder = new ObjectMapper().readValue(newcontent, Order.class);

        restOrderMockMvc
            .perform(
                post(ENTITY_LINES_API_URL + "?id=" + createdOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderLine))
            )
            .andExpect(status().isCreated());
        // Validate the Order in the database

    }

    @Test
    @Transactional
    void fullUpdateQuantityToZero() throws Exception {
        User usr = new User();
        usr.setLogin("user");
        order.setOwner(usr);

        orderLine.setProduct(prod);
        prod.setStock(stock);
        stock.setProduct(prod);

        // Initialize the database
        MvcResult result = restOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated())
            .andReturn();

        String content = result.getResponse().getContentAsString();
        String before = "\"purchaseDate\":";
        String after = ",\"purchasePrice\"";
        String newcontent =
            content.substring(0, content.indexOf(before) + before.length()) + "null" + content.substring(content.indexOf(after));
        Order createdOrder = new ObjectMapper().readValue(newcontent, Order.class);

        MvcResult resultOl = restOrderMockMvc
            .perform(
                post(ENTITY_LINES_API_URL + "?id=" + createdOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderLine))
            )
            .andExpect(status().isCreated())
            .andReturn();

        String contentOl = resultOl.getResponse().getContentAsString();
        String newcontentOl =
            contentOl.substring(0, contentOl.indexOf(before) + before.length()) + "null" + contentOl.substring(contentOl.indexOf(after));
        OrderLine createdOrderLine = new ObjectMapper().readValue(newcontentOl, OrderLine.class);

        int databaseSizeBeforeUpdate = orderLineRepository.findAll().size();

        // Update the orderLine using partial update
        OrderLine partialUpdatedOrderLine = new OrderLine();
        partialUpdatedOrderLine.setId(createdOrderLine.getId());

        partialUpdatedOrderLine.quantity(0);

        restOrderMockMvc
            .perform(
                patch(ENTITY_LINES_API_URL + "/{id}", partialUpdatedOrderLine.getId())
                    .contentType("application/json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderLine))
            )
            .andExpect(status().isNoContent());

        // Validate the OrderLine in the database
        List<OrderLine> orderLineList = orderLineRepository.findAll();
        assertThat(orderLineList).hasSize(databaseSizeBeforeUpdate - 1);
    }

    @Test
    @Transactional
    void createOrderWithExistingId() throws Exception {
        // Create the Order with an existing ID
        order.setId(1L);

        int databaseSizeBeforeCreate = orderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void getAllOrders() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        // Get all the orderList
        restOrderMockMvc.perform(get(ENTITY_API_URL + "?sort=id,desc")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void getOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        // Get the order
        restOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, order.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.purchaseDate").value(sameInstant(DEFAULT_PURCHASE_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingOrder() throws Exception {
        // Get the order
        restOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // Update the order
        Order updatedOrder = orderRepository.findById(order.getId()).get();
        // Disconnect from session so that the updates on updatedOrder are not directly saved in db
        em.detach(updatedOrder);
        updatedOrder.purchaseDate(UPDATED_PURCHASE_DATE);

        restOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrder))
            )
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    void putNonExistingOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();
        order.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, order.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(order))
            )
            .andExpect(status().isForbidden());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();
        order.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(order))
            )
            .andExpect(status().isForbidden());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderWithPatch() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // Update the order using partial update
        Order partialUpdatedOrder = new Order();
        partialUpdatedOrder.setId(order.getId());

        partialUpdatedOrder.purchaseDate(UPDATED_PURCHASE_DATE);

        restOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrder))
            )
            .andExpect(status().isOk());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void fullUpdateOrderWithPatch() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // Update the order using partial update
        Order partialUpdatedOrder = new Order();
        partialUpdatedOrder.setId(order.getId());

        partialUpdatedOrder.purchaseDate(UPDATED_PURCHASE_DATE);

        restOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrder))
            )
            .andExpect(status().isOk());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchNonExistingOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();
        order.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, order.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(order))
            )
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void getCart() throws Exception {
        orderRepository.saveAndFlush(order);
        restOrderMockMvc.perform(get("/api/myCart", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();
        order.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(order))
            )
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();
        order.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isForbidden());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        int databaseSizeBeforeDelete = orderRepository.findAll().size();

        // Delete the order
        restOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, order.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());

        // Validate the database contains one less item
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeDelete);
    }

    @Test
    @Transactional
    void testpourUgo() throws Exception {
        OrderLine orderline = new OrderLine();
        orderline.setQuantity(10);
        HashSet<OrderLine> hashset = new HashSet<OrderLine>();
        hashset.add(orderline);
        order.setOrderLines(hashset);

        orderRepository.saveAndFlush(order);
    }
}
// mvn verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.projectKey=quentindmrq -Dsonar.host.url=https://sonarcloud.io/
