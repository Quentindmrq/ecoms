package om.cgi.formation.jhipster.ecom.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import javax.persistence.LockModeType;
import om.cgi.formation.jhipster.ecom.domain.Order;
import om.cgi.formation.jhipster.ecom.domain.OrderLine;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import om.cgi.formation.jhipster.ecom.domain.enumeration.Game;
import om.cgi.formation.jhipster.ecom.domain.enumeration.ProductType;
import om.cgi.formation.jhipster.ecom.repository.OrderRepository;
import om.cgi.formation.jhipster.ecom.repository.StockRepository;
import om.cgi.formation.jhipster.ecom.web.rest.errors.BadRequestAlertException;
import org.apache.commons.lang3.EnumUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link om.cgi.formation.jhipster.ecom.domain.Stock}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StockResource {

    private final Logger log = LoggerFactory.getLogger(StockResource.class);

    private static final String ENTITY_NAME = "stock";

    private static final String NO_ENTITY = "Entity not found";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StockRepository stockRepository;

    private final OrderRepository orderRepository;

    public StockResource(StockRepository stockRepository, OrderRepository orderRepository) {
        this.stockRepository = stockRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * {@code POST  /stocks} : Create a new stock.
     *
     * @param stock the stock to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stock, or with status {@code 400 (Bad Request)} if the stock has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @PostMapping("/stocks")
    public ResponseEntity<Stock> createStock(@RequestBody Stock stock) throws URISyntaxException {
        log.debug("REST request to save Stock : {}", stock);
        if (stock.getId() != null) {
            throw new BadRequestAlertException("A new stock cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Stock result = stockRepository.save(stock);

        return ResponseEntity
            .created(new URI("/api/stocks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stocks/:id} : Updates an existing stock.
     *
     * @param id the id of the stock to save.
     * @param stock the stock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stock,
     * or with status {@code 400 (Bad Request)} if the stock is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @PutMapping("/stocks/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable(value = "id", required = false) final Long id, @RequestBody Stock stock)
        throws URISyntaxException {
        log.debug("REST request to update Stock : {}, {}", id, stock);
        if (stock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stockRepository.existsById(id)) {
            throw new BadRequestAlertException(NO_ENTITY, ENTITY_NAME, "idnotfound");
        }

        Stock result = stockRepository.save(stock);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stock.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stocks/:id} : Partial updates given fields of an existing stock, field will ignore if it is null
     *
     * @param id the id of the stock to save.
     * @param stock the stock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stock,
     * or with status {@code 400 (Bad Request)} if the stock is not valid,
     * or with status {@code 404 (Not Found)} if the stock is not found,
     * or with status {@code 500 (Internal Server Error)} if the stock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @PatchMapping(value = "/stocks/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Stock> partialUpdateStock(@PathVariable(value = "id", required = false) final Long id, @RequestBody Stock stock)
        throws URISyntaxException {
        log.debug("REST request to partial update Stock partially : {}, {}", id, stock);
        if (stock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idIsinvalid");
        }

        if (!stockRepository.existsById(id)) {
            throw new BadRequestAlertException("did not found Entity", ENTITY_NAME, "idnotfound");
        }

        Optional<Stock> result = stockRepository
            .findById(stock.getId())
            .map(
                existingStock -> {
                    if (stock.getStock() != null) {
                        existingStock.setStock(stock.getStock());
                    }

                    return existingStock;
                }
            )
            .map(stockRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stock.getId().toString())
        );
    }

    /**
     * {@code GET  /stocks} : get all the stocks in a page, default is page 1 of size 5.
     * @param page the number of the page you want
     * @param size the size of the page
     * @param sort
     * @param way by default top down but any other word will make it down to top
     * @param game the game we want, all by default
     * @param type the type of services, all by default
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stocks in body.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @GetMapping("/stocks")
    public Page<Stock> getAllStocksPageInBody(
        @RequestParam(required = false, value = "page", defaultValue = "1") int page,
        @RequestParam(required = false, value = "size", defaultValue = "5") int size,
        @RequestParam(required = false, value = "sort", defaultValue = "stock") String sort,
        @RequestParam(required = false, value = "way", defaultValue = "descending") String way,
        @RequestParam(required = false, value = "game", defaultValue = "none") String game,
        @RequestParam(required = false, value = "type", defaultValue = "none") String type
    ) {
        if (size <= 0) {
            throw new BadRequestAlertException("size must be superior to 0", ENTITY_NAME, "size <= 0");
        }
        Pageable pageRequested;
        Sort pageSort;

        if (way.equals("descending")) {
            pageSort = Sort.by(sort).descending();
        } else {
            pageSort = Sort.by(sort);
        }
        pageRequested = PageRequest.of(Math.toIntExact(page) - 1, Math.toIntExact(size), pageSort);

        //verify the asked game does exists
        //an invalid one will return the generic page
        if (EnumUtils.isValidEnum(Game.class, game)) {
            //verify the asked type exists
            //an invalid one will return all types
            if (EnumUtils.isValidEnum(ProductType.class, type)) {
                return stockRepository.findallbygameandtype(Game.valueOf(game), ProductType.valueOf(type), pageRequested);
            }
            return stockRepository.findallbygame(Game.valueOf(game), pageRequested);
        }

        removeOldCart();

        log.debug("REST request to get all Stocks");
        return stockRepository.findAll(pageRequested);
    }

    private void removeOldCart() {
        //this part will delete all old orders and not validated
        List<Order> orders = orderRepository.findAllByPurchasedIsFalse();
        for (Iterator<Order> it = orders.iterator(); it.hasNext();) {
            Order order = it.next();
            if (ChronoUnit.SECONDS.between(order.getPurchaseDate(), ZonedDateTime.now()) >= 60) {
                //before deleting the order we
                Set<OrderLine> orderl = order.getOrderLines();
                for (OrderLine ol : orderl) {
                    Stock stock = ol.getProduct().getStock();
                    stock.setStock(stock.getStock() + ol.getQuantity());
                }
                order.setOwner(null);
                orderRepository.deleteById(order.getId());
                it.remove();
                //orderRepository.saveAndFlush(order);

            }
        }
    }

    /**
     * {@code GET  /stocks/:id} : get the "id" stock.
     *
     * @param id the id of the stock to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stock, or with status {@code 404 (Not Found)}.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @GetMapping("/stocks/{id}")
    public ResponseEntity<Stock> getStock(@PathVariable Long id) {
        log.debug("REST request to get Stock : {}", id);
        Optional<Stock> stock = stockRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stock);
    }

    /**
     * {@code DELETE  /stocks/:id} : delete the "id" stock.
     *
     * @param id the id of the stock to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @DeleteMapping("/stocks/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable("id") Long id) {
        log.debug("REST request to delete Stock : {}", id);
        stockRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code Patch  /stocksInCart/:id} : a new item has been added a cart.
     * for now it doesn't do anything th stock is decremented when the order is paid
     *
     * @param id of the stock that just got added to the cart.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} if it worked {@code 404 (Not Found)}.
     */
    @Lock(LockModeType.OPTIMISTIC)
    @PatchMapping("/addStocksInCart/{id}")
    public ResponseEntity<Stock> patchEntryInCart(@PathVariable Long id, @RequestParam(required = true, value = "amount") int amount) {
        log.debug("REST request to patch Stock because of a cart entry : {}", id);
        if (!stockRepository.existsById(id)) {
            throw new BadRequestAlertException(NO_ENTITY, ENTITY_NAME, "notfound");
        }
        Optional<Stock> stock = stockRepository.findById(id);
        if (stock.isEmpty()) {
            throw new BadRequestAlertException("id is not valid", ENTITY_NAME, "idisnull");
        }

        int currStock = stock.get().getStock();
        if (currStock == 0) {
            throw new BadRequestAlertException("the stock is empty", ENTITY_NAME, "stockIsZero");
        }
        if (currStock < amount) {
            throw new BadRequestAlertException("the amount is too high", ENTITY_NAME, "stock < amount");
        }
        return ResponseUtil.wrapOrNotFound(stock);
    }

    /**
     * for now it doesn't do anything th stock is decremented when the order is paid
     * @param id
     * @param amount
     * @return
     */
    @Lock(LockModeType.OPTIMISTIC)
    @PatchMapping("/deleteStocksInCart/{id}")
    public ResponseEntity<Stock> patchOutOfCart(@PathVariable Long id, @RequestParam(required = true, value = "amount") int amount) {
        log.debug("REST request to patch Stock because of a cart deletion : {}", id);
        if (!stockRepository.existsById(id)) {
            throw new BadRequestAlertException(NO_ENTITY, ENTITY_NAME, "notfound");
        }
        Optional<Stock> stock = stockRepository.findById(id);
        if (stock.isEmpty()) {
            throw new BadRequestAlertException("id is not valid", ENTITY_NAME, "idisnull");
        }

        return ResponseUtil.wrapOrNotFound(stock);
    }

    /**
     *
     * @param id the id of the sock
     * @param amount the amount bought
     * @return
     */
    @Lock(LockModeType.OPTIMISTIC)
    @PatchMapping("/finalbuy/{id}")
    public ResponseEntity<Order> finalbuy(@PathVariable Long id, @RequestParam(required = true, value = "amount") int amount) {
        log.debug("REST request to patch Stock because of a purchase: {}", id);
        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException(NO_ENTITY, ENTITY_NAME, "notfound");
        }
        Optional<Order> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new BadRequestAlertException("id is not valid", ENTITY_NAME, "idisnull");
        }

        order.get().setPurchased(true);

        return ResponseUtil.wrapOrNotFound(order);
    }
}
