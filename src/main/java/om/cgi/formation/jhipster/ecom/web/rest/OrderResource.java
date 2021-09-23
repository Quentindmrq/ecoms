package om.cgi.formation.jhipster.ecom.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import om.cgi.formation.jhipster.ecom.domain.Authority;
import om.cgi.formation.jhipster.ecom.domain.Order;
import om.cgi.formation.jhipster.ecom.domain.OrderLine;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import om.cgi.formation.jhipster.ecom.domain.User;
import om.cgi.formation.jhipster.ecom.repository.OrderRepository;
import om.cgi.formation.jhipster.ecom.repository.UserRepository;
import om.cgi.formation.jhipster.ecom.security.AuthoritiesConstants;
import om.cgi.formation.jhipster.ecom.service.UserService;
import om.cgi.formation.jhipster.ecom.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link om.cgi.formation.jhipster.ecom.domain.Order}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderResource {

    private final Logger log = LoggerFactory.getLogger(OrderResource.class);

    private static final String ENTITY_NAME = "order";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String INVALID_ID = "invalid id";

    private final OrderRepository orderRepository;

    private final UserService userService;

    private final UserRepository userRepository;

    public OrderResource(OrderRepository orderRepository, UserService userService, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /orders} : Create a new order.
     *
     * @param order the order to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new order, or with status {@code 400 (Bad Request)} if the order has already an ID.
     * @throws Exception
     */
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) throws Exception {
        log.debug("REST request to save Order : {}", order);
        if (order.getId() != null) {
            throw new BadRequestAlertException("A new order cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<User> optUser = this.userRepository.findOneByLogin(order.getOwner().getLogin());
        if (optUser.isPresent()) {
            order.setOwner(optUser.get());
            optUser.get().getorders().add(order);
        } else {
            throw new BadRequestAlertException("unknown user", ENTITY_NAME, "nouser");
        }

        Optional<Order> oldcart = orderRepository.findOneByOwnerIsCurrentUserAndPurchasedIsFalse();

        if (oldcart.isPresent()) {
            deleteOrder(oldcart.get().getId());
        }

        order.setPurchaseDate(ZonedDateTime.now());

        Order result = orderRepository.saveAndFlush(order);
        return ResponseEntity
            .created(new URI("/api/orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orders/:id} : Updates an existing order.
     *
     * @param id the id of the order to save.
     * @param order the order to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orders/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable(value = "id", required = false) final Long id, @RequestBody Order order)
        throws URISyntaxException {
        log.debug("REST request to update Order : {}, {}", id, order);
        if (order.getId() == null) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Order result = orderRepository.save(order);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, order.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /orders/:id} : Partial updates given fields of an existing order, field will ignore if it is null
     *
     * @param id the id of the order to save.
     * @param order the order to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 404 (Not Found)} if the order is not found,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/orders/{id}", consumes = "application/json")
    public ResponseEntity<Order> partialUpdateOrder(@PathVariable(value = "id", required = true) final Long id, @RequestBody Order order)
        throws URISyntaxException {
        log.debug("REST request to partial update Order partially : {}, {}", id, order);
        if (order.getId() == null) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Order> result = orderRepository.findById(order.getId());

        if (result.isEmpty()) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        Order newOrder = result.get();
        newOrder.setPurchasePrice(order.getPurchasePrice());
        newOrder.setBillingAddress(order.getBillingAddress());
        newOrder.setPurchased(order.getPurchased());
        newOrder.setPurchaseDate(ZonedDateTime.now());

        orderRepository.saveAndFlush(newOrder);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, order.getId().toString())
        );
    }

    /**
     * {@code GET  /orders} : get all the orders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orders in body.
     */
    @GetMapping("/orders")
    public Page<Order> getAllOrders(
        @RequestParam(required = false, value = "page", defaultValue = "0") int page,
        @RequestParam(required = false, value = "size", defaultValue = "5") int size
    ) {
        log.debug("REST request to get all Orders");
        Pageable pageRequested;
        pageRequested = PageRequest.of(Math.toIntExact(page), Math.toIntExact(size));
        Optional<User> usr = userService.getUserWithAuthorities();
        if (usr.isEmpty()) {
            throw new BadRequestAlertException("Invalid login", ENTITY_NAME, "logininvalid");
        }

        StringBuilder bld = new StringBuilder();
        for (Authority auth : usr.get().getAuthorities()) {
            bld.append(auth.getName());
        }

        String auths = bld.toString();
        if (auths.contains(AuthoritiesConstants.ADMIN)) {
            return orderRepository.findAll(pageRequested);
        }
        if (auths.contains(AuthoritiesConstants.USER)) {
            return orderRepository.findByOwnerIsCurrentUser(pageRequested);
        }

        return null;
    }

    @GetMapping("/myCart")
    public ResponseEntity<Order> getMyCart() {
        return ResponseUtil.wrapOrNotFound(orderRepository.findOneByOwnerIsCurrentUserAndPurchasedIsFalse());
    }

    /**
     * {@code GET  /orders/:id} : get the "id" order.
     *
     * @param id the id of the order to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the order, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        log.debug("REST request to get Order : {}", id);
        List<String> auth = userService.getAuthorities();
        if (auth.contains(AuthoritiesConstants.ADMIN)) {
            Optional<Order> order = orderRepository.findOneById(id);
            return ResponseUtil.wrapOrNotFound(order);
        }
        Optional<Order> order = orderRepository.findOneByIdIfOwnerIsCurrentUser(id);
        return ResponseUtil.wrapOrNotFound(order);
    }

    /**
     * {@code DELETE  /orders/:id} : delete the "id" order.
     *
     * @param id the id of the order to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        log.debug("REST request to delete Order : {}", id);

        Optional<Order> order = orderRepository.findOneByIdIfOwnerIsCurrentUser(id);

        if (order.isEmpty()) {
            throw new BadRequestAlertException(INVALID_ID, ENTITY_NAME, INVALID_ID);
        }

        Set<OrderLine> orderl = order.get().getOrderLines();
        for (OrderLine ol : orderl) {
            Stock stock = ol.getProduct().getStock();
            log.debug(" added {} to stock already at {} ", ol.getQuantity(), stock.getStock());
            stock.setStock(stock.getStock() + ol.getQuantity());
        }

        order.get().setOwner(null);
        orderRepository.saveAndFlush(order.get());

        orderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
