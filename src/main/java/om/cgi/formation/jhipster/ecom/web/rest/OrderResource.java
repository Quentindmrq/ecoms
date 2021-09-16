package om.cgi.formation.jhipster.ecom.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import om.cgi.formation.jhipster.ecom.domain.Order;
import om.cgi.formation.jhipster.ecom.domain.OrderLine;
import om.cgi.formation.jhipster.ecom.domain.Product;
import om.cgi.formation.jhipster.ecom.domain.User;
import om.cgi.formation.jhipster.ecom.repository.OrderRepository;
import om.cgi.formation.jhipster.ecom.repository.ProductRepository;
import om.cgi.formation.jhipster.ecom.repository.UserRepository;
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

    private final OrderRepository orderRepository;

    private final UserService userService;

    private final ProductRepository productRepo;

    private final UserRepository userRepository;

    public OrderResource(
        OrderRepository orderRepository,
        UserService userService,
        UserRepository userRepository,
        ProductRepository productRepo
    ) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.productRepo = productRepo;
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
        }

        // Iterator<OrderLine> iter = neworder.getOrderLines().iterator();
        // while (iter.hasNext()) {
        //     OrderLine ol = iter.next();
        //     Optional<Product> prod = productRepo.findById(ol.getProduct().getId());
        //     if (prod.isEmpty()) {
        //         throw new Exception("ça marche po");
        //     }
        // }

        order.setPurchaseDate(ZonedDateTime.now());

        // TODO Add Order.id to all OrderLines from order
        // Set<OrderLine> orderLines = order.getOrderLines();

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
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
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
    @PatchMapping(value = "/orders/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Order> partialUpdateOrder(@PathVariable(value = "id", required = false) final Long id, @RequestBody Order order)
        throws URISyntaxException {
        log.debug("REST request to partial update Order partially : {}, {}", id, order);
        if (order.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Order> result = orderRepository
            .findById(order.getId())
            .map(
                existingOrder -> {
                    if (order.getPurchaseDate() != null) {
                        existingOrder.setPurchaseDate(order.getPurchaseDate());
                    }

                    return existingOrder;
                }
            )
            .map(orderRepository::save);

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
    public List<Order> getAllOrders() {
        log.debug("REST request to get all Orders");
        List<String> auth = userService.getAuthorities();
        if (auth.contains(AuthoritiesConstants.ADMIN)) {
            return orderRepository.findAll();
        }
        if (auth.contains(AuthoritiesConstants.USER)) {
            return orderRepository.findByOwnerIsCurrentUser();
        }

        return null;
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
        orderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
