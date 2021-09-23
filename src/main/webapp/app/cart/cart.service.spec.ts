import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CartService } from './cart.service';
import { TranslateDirective } from 'app/shared/language/translate.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
// import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Order } from 'app/entities/order/order.model';
import { OrderLine } from 'app/entities/order-line/order-line.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from 'app/entities/product/product.model';
import { Stock } from 'app/entities/stock/stock.model';
import { MatDialogModule } from '@angular/material/dialog';

describe('CartService', () => {
  let service: CartService;
  let expectedResult: OrderLine[] | Order | boolean | number | null;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslateDirective],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgxWebstorageModule.forRoot(),
        MatDialogModule,
      ],
    });
    expectedResult = null;
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Service methods', () => {
    it('should have added one orderLine', () => {
      service.cart.subscribe(cartOrder => (expectedResult = cartOrder));
      service.addToCart(new Product(123, undefined, undefined, undefined, 15), 3);
      expect(service.numberOfItems).toEqual(3);
      expect(service.totalPrice).toEqual(15);
      expect((expectedResult as Order).orderLines?.length).toEqual(1);
    });

    it('should be empty', () => {
      service.cart.subscribe(cartOrder => (expectedResult = cartOrder));
      let stocks: Stock[] = [];
      service.cartStock.subscribe(cartOrder => (stocks = cartOrder));
      expect(service.numberOfItems).toEqual(0);
      expect(service.totalPrice).toEqual(0);
      expect(stocks).toEqual([]);
    });

    it('should be null after discard', () => {
      service.cart.subscribe(cartOrder => (expectedResult = cartOrder));
      const prod = new Product(123);
      service.addToCart(prod, 2);
      service.deleteFromCart(prod);
      expect(service.numberOfItems).toEqual(0);
      expect(expectedResult).toEqual(null);
    });

    it('should be null after last product deleted', () => {
      service.cart.subscribe(cartOrder => (expectedResult = cartOrder));
      service.addToCart(new Product(123));
      service.discard();
      expect(service.numberOfItems).toEqual(0);
      expect(expectedResult).toEqual(null);
    });

    it('should return false', async () => {
      await service.isCartDeleted().then(ret => (expectedResult = ret));

      expect(expectedResult).toEqual(false);
    });

    it('should have one orderline with 2 items', () => {
      service.cart.subscribe(cartOrder => (expectedResult = cartOrder));
      const prod = new Product(123);
      service.addToCart(prod, 3);
      service.removeOneFromCart(prod);
      expect(service.numberOfItems).toEqual(2);
      expect((expectedResult as Order).orderLines?.length).toEqual(1);
    });
  });
});
