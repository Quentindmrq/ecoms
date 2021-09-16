package om.cgi.formation.jhipster.ecom.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import om.cgi.formation.jhipster.ecom.IntegrationTest;
import om.cgi.formation.jhipster.ecom.domain.Stock;
import om.cgi.formation.jhipster.ecom.repository.StockRepository;
import om.cgi.formation.jhipster.ecom.security.AuthoritiesConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StockResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StockResourceIT {

    private static final Integer DEFAULT_STOCK = 1;
    private static final Integer UPDATED_STOCK = 2;

    private static final String ENTITY_API_URL = "/api/stocks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String CART_API_URL = "/api/addStocksInCart/{id}";
    private static final String BUY_API_URL = "/api/finalbuy/{id}";
    private static final String CART_API_URL_DELETE = "/api/deleteStocksInCart/{id}";
    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStockMockMvc;

    private Stock stock;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stock createEntity(EntityManager em) {
        Stock stock = new Stock().stock(DEFAULT_STOCK);
        return stock;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stock createUpdatedEntity(EntityManager em) {
        Stock stock = new Stock().stock(UPDATED_STOCK);
        return stock;
    }

    @BeforeEach
    public void initTest() {
        stock = createEntity(em);
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void createStockAdmin() throws Exception {
        int databaseSizeBeforeCreate = stockRepository.findAll().size();
        // Create the Stock
        restStockMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isCreated());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeCreate + 1);
        Stock testStock = stockList.get(stockList.size() - 1);
        assertThat(testStock.getStock()).isEqualTo(DEFAULT_STOCK);
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void createStockWithExistingIdAdmin() throws Exception {
        // Create the Stock with an existing ID
        stock.setId(1L);

        int databaseSizeBeforeCreate = stockRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStockMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void createStock() throws Exception {
        // Create the Stock
        restStockMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    void createStockWithExistingId() throws Exception {
        // Create the Stock with an existing ID
        stock.setId(1L);

        int databaseSizeBeforeCreate = stockRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStockMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isForbidden());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStocks() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get all the stockList
        restStockMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.content.[*].id").value(hasItem(stock.getId().intValue())))
            .andExpect(jsonPath("$.content.[*].stock").value(hasItem(DEFAULT_STOCK)));
    }

    @Test
    @Transactional
    void getStock() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc
            .perform(get(ENTITY_API_URL_ID, stock.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stock.getId().intValue()))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK));
    }

    @Test
    @Transactional
    void getNonExistingStock() throws Exception {
        // Get the stock
        restStockMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStock() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Update the stock
        Stock updatedStock = stockRepository.findById(stock.getId()).get();
        // Disconnect from session so that the updates on updatedStock are not directly saved in db
        em.detach(updatedStock);
        updatedStock.stock(UPDATED_STOCK);

        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStock.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStock))
            )
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void putNewStockAdmin() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        int databaseSizeBeforeUpdate = stockRepository.findAll().size();

        // Update the stock
        Stock updatedStock = stockRepository.findById(stock.getId()).get();
        // Disconnect from session so that the updates on updatedStock are not directly saved in db
        em.detach(updatedStock);
        updatedStock.stock(UPDATED_STOCK);

        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStock.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStock))
            )
            .andExpect(status().isOk());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
        Stock testStock = stockList.get(stockList.size() - 1);
        assertThat(testStock.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void putNonExistingStock() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stock.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stock))
            )
            .andExpect(status().isForbidden());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void putWithIdMismatchStockAdmin() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stock))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStock() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stock))
            )
            .andExpect(status().isForbidden());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void putWithMissingIdPathParamStockAdmin() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStock() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isForbidden());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStockWithPatch() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        int databaseSizeBeforeUpdate = stockRepository.findAll().size();

        // Update the stock using partial update
        Stock partialUpdatedStock = new Stock();
        partialUpdatedStock.setId(stock.getId());

        partialUpdatedStock.stock(UPDATED_STOCK);

        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStock.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStock))
            )
            .andExpect(status().isOk());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
        Stock testStock = stockList.get(stockList.size() - 1);
        assertThat(testStock.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void fullUpdateStockWithPatch() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        int databaseSizeBeforeUpdate = stockRepository.findAll().size();

        // Update the stock using partial update
        Stock partialUpdatedStock = new Stock();
        partialUpdatedStock.setId(stock.getId());

        partialUpdatedStock.stock(UPDATED_STOCK);

        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStock.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStock))
            )
            .andExpect(status().isOk());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
        Stock testStock = stockList.get(stockList.size() - 1);
        assertThat(testStock.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void patchNonExistingStock() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stock.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stock))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStock() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stock))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStock() throws Exception {
        int databaseSizeBeforeUpdate = stockRepository.findAll().size();
        stock.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStockMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stock)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stock in the database
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStock() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Delete the stock
        restStockMockMvc
            .perform(delete(ENTITY_API_URL_ID, stock.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    @Transactional
    void deleteStockAdmin() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        int databaseSizeBeforeDelete = stockRepository.findAll().size();

        // Delete the stock
        restStockMockMvc
            .perform(delete(ENTITY_API_URL_ID, stock.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stock> stockList = stockRepository.findAll();
        assertThat(stockList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    void getPageStock() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc
            .perform(get(ENTITY_API_URL, stock.getId()).queryParam("page", "2").queryParam("size", "5"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE));
    }

    @Test
    @Transactional
    void getPageStockWithInvalidSize() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc.perform(get(ENTITY_API_URL).queryParam("page", "1").queryParam("size", "0")).andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void addCartWithTooMuchAmount() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);
        Integer querystock = stock.getStock() + 10000;

        // Get the stock
        restStockMockMvc
            .perform(patch(CART_API_URL, stock.getId()).queryParam("amount", querystock.toString()))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void addToCartBasic() throws Exception {
        stockRepository.saveAndFlush(stock);
        restStockMockMvc.perform(patch(CART_API_URL, stock.getId()).queryParam("amount", "1")).andExpect(status().isOk());
    }

    @Test
    @Transactional
    void deletefromCartBasic() throws Exception {
        stockRepository.saveAndFlush(stock);
        restStockMockMvc.perform(patch(CART_API_URL_DELETE, stock.getId()).queryParam("amount", "1")).andExpect(status().isOk());
    }

    @Test
    @Transactional
    void buyStock() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);
        Integer beforestock = stock.getStock();

        // take the whole stock
        restStockMockMvc.perform(patch(BUY_API_URL, stock.getId()).queryParam("amount", "10")).andExpect(status().isOk());

        //chek that stock was bought
        Optional<Stock> newstock = stockRepository.findById(stock.getId());
        assertThat(newstock.isPresent()).isTrue();
        assertThat(beforestock == (newstock.get().getStock() + 10)).isTrue();
    }

    @Test
    @Transactional
    void buyEmptyStock() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);
        Integer querystock = stock.getStock();

        // take the whole stock
        restStockMockMvc.perform(patch(BUY_API_URL, stock.getId()).queryParam("amount", querystock.toString())).andExpect(status().isOk());

        // take the whole stock
        restStockMockMvc.perform(patch(BUY_API_URL, stock.getId()).queryParam("amount", querystock.toString())).andExpect(status().isOk());
        //stock should be empty
        restStockMockMvc
            .perform(patch(CART_API_URL, stock.getId()).queryParam("amount", querystock.toString()))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void deletefromCartBasicbadid() throws Exception {
        stockRepository.saveAndFlush(stock);
        restStockMockMvc
            .perform(patch(CART_API_URL_DELETE, stock.getId() + 1514).queryParam("amount", "1"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void buybadid() throws Exception {
        stockRepository.saveAndFlush(stock);
        restStockMockMvc.perform(patch(BUY_API_URL, stock.getId() + 1514).queryParam("amount", "1")).andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void addtoCartBasicbadid() throws Exception {
        stockRepository.saveAndFlush(stock);
        restStockMockMvc.perform(patch(CART_API_URL, stock.getId() + 1514).queryParam("amount", "1")).andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void getascending() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc.perform(get(ENTITY_API_URL).queryParam("page", "1").queryParam("way", "up")).andExpect(status().isOk());
    }

    @Test
    @Transactional
    void getGame() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc.perform(get(ENTITY_API_URL).queryParam("game", "OVERWATCH")).andExpect(status().isOk());
    }

    @Test
    @Transactional
    void getGameAndType() throws Exception {
        // Initialize the database
        stockRepository.saveAndFlush(stock);

        // Get the stock
        restStockMockMvc
            .perform(get(ENTITY_API_URL).queryParam("game", "OVERWATCH").queryParam("type", "INTING"))
            .andExpect(status().isOk());
    }
}
