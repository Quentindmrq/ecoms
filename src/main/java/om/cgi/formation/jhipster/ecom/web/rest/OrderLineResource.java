package om.cgi.formation.jhipster.ecom.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import om.cgi.formation.jhipster.ecom.domain.Order;
import om.cgi.formation.jhipster.ecom.domain.OrderLine;
import om.cgi.formation.jhipster.ecom.domain.Product;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import om.cgi.formation.jhipster.ecom.repository.OrderLineRepository;
import om.cgi.formation.jhipster.ecom.repository.OrderRepository;
import om.cgi.formation.jhipster.ecom.repository.ProductRepository;
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
 * REST controller for managing {@link om.cgi.formation.jhipster.ecom.domain.OrderLine}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderLineResource {

    private final Logger log = LoggerFactory.getLogger(OrderLineResource.class);

    private static final String ENTITY_NAME = "orderLine";

    private static final String INVALID_ID = "invalid id";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderLineRepository orderLineRepository;

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;

    public OrderLineResource(
        OrderLineRepository orderLineRepository,
        OrderRepository orderRepository,
        ProductRepository productRepository
    ) {
        this.orderLineRepository = orderLineRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    /**
     * {@code POST  /order-lines} : Create a new orderLine.
     *
     * @param orderLine the orderLine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderLine, or with status {@code 400 (Bad Request)} if the orderLine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-lines")
    public ResponseEntity<OrderLine> createOrderLine(
        @RequestParam(value = "id", required = true) final int orderId,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        log.debug("REST request to save OrderLine : {}", orderLine);
        if (orderLine.getId() != null) {
            throw new BadRequestAlertException("A new orderLine cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<Order> order = orderRepository.findById((long) orderId);

        if (order.isEmpty()) {
            throw new BadRequestAlertException("The order doesn't exists", ENTITY_NAME, "order doesn't exists");
        }

        if (order.get().getPurchased() != 0) {
            throw new BadRequestAlertException("The order is done", ENTITY_NAME, "already purchased");
        }

        order.get().getOrderLines().add(orderLine);
        orderLine.setOrder(order.get());
        order.get().setPurchaseDate(ZonedDateTime.now());

        Optional<Product> product = productRepository.findById(orderLine.getProduct().getId());

        if (product.isEmpty()) {
            throw new BadRequestAlertException("product doesnt exists", ENTITY_NAME, "productinvalid");
        }

        Stock stock = product.get().getStock();

        //if there isn't enough stock the request wont go throught
        if (stock.getStock() < orderLine.getQuantity()) {
            throw new BadRequestAlertException("not enough stock", ENTITY_NAME, "no stock");
        }
        stock.setStock(stock.getStock() - orderLine.getQuantity());

        OrderLine result = orderLineRepository.save(orderLine);
        return ResponseEntity
            .created(new URI("/api/order-lines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-lines/:id} : Updates an existing orderLine.
     *
     * @param id the id of the orderLine to save.
     * @param orderLine the orderLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderLine,
     * or with status {@code 400 (Bad Request)} if the orderLine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-lines/{id}")
    public ResponseEntity<OrderLine> updateOrderLine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        log.debug("REST request to update OrderLine : {}, {}", id, orderLine);
        if (orderLine.getId() == null) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderLine.getId())) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        if (!orderLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderLine result = orderLineRepository.save(orderLine);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-lines/:id} : Partial updates given fields of an existing orderLine, field will ignore if it is null
     *
     * @param id the id of the orderLine to save.
     * @param orderLine the orderLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderLine,
     * or with status {@code 400 (Bad Request)} if the orderLine is not valid,
     * or with status {@code 404 (Not Found)} if the orderLine is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-lines/{id}", consumes = "application/json")
    public ResponseEntity<OrderLine> partialUpdateOrderLine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderLine partially : {}, {}", id, orderLine);
        if (orderLine.getId() == null) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderLine.getId())) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        if (!orderLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderLine> result = orderLineRepository.findById(orderLine.getId());
        if (result.isEmpty()) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        Optional<Product> product = productRepository.findById(result.get().getProduct().getId());

        if (product.isEmpty()) {
            throw new BadRequestAlertException("product doesnt exists", ENTITY_NAME, "productinvalid");
        }

        Stock stock = product.get().getStock();

        int stockChange = orderLine.getQuantity() - result.get().getQuantity();

        //if there isn't enough stock the request wont go throught
        if (stock.getStock() < stockChange) {
            throw new BadRequestAlertException("not enough stock", ENTITY_NAME, "no stock");
        }

        stock.setStock(stock.getStock() - stockChange);

        // if we set the quantity to 0 or less the orderline is deleted
        if (orderLine.getQuantity() <= 0) {
            deleteOrderLine(id);
            return ResponseEntity
                .noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
        }

        result.get().setQuantity(orderLine.getQuantity());

        Optional<Order> order = orderRepository.findOneByIdIfOwnerIsCurrentUser(orderLine.getOrder().getId());

        if (order.isEmpty()) {
            throw new BadRequestAlertException("order doesnt exists", ENTITY_NAME, "orderinvalid");
        }

        order.get().setPurchaseDate(ZonedDateTime.now());

        orderLineRepository.saveAndFlush(result.get());

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString())
        );
    }

    /**
     * {@code GET  /order-lines} : get all the orderLines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderLines in body.
     */
    @GetMapping("/order-lines")
    public List<OrderLine> getAllOrderLines() {
        log.debug("REST request to get all OrderLines");
        return orderLineRepository.findAll();
    }

    /**
     * {@code GET  /order-lines/:id} : get the "id" orderLine.
     *
     * @param id the id of the orderLine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderLine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-lines/{id}")
    public ResponseEntity<OrderLine> getOrderLine(@PathVariable Long id) {
        log.debug("REST request to get OrderLine : {}", id);
        Optional<OrderLine> orderLine = orderLineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderLine);
    }

    /**
     * {@code DELETE  /order-lines/:id} : delete the "id" orderLine.
     *
     * @param id the id of the orderLine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-lines/{id}")
    public ResponseEntity<Void> deleteOrderLine(@PathVariable Long id) {
        log.debug("REST request to delete OrderLine : {}", id);

        Optional<OrderLine> orderline = orderLineRepository.findById(id);
        if (orderline.isEmpty()) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        Optional<Product> product = productRepository.findById(orderline.get().getProduct().getId());

        if (product.isEmpty()) {
            throw new BadRequestAlertException("product doesnt exists", ENTITY_NAME, "productinvalid");
        }
        Stock stock = product.get().getStock();
        stock.setStock(stock.getStock() + orderline.get().getQuantity());

        Order order = orderline.get().getOrder();
        order.removeOrderLinebyId(id);
        orderline.get().setOrder(null);

        orderLineRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
