import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Address } from 'app/entities/address/address.model';
import { OrderLine } from 'app/entities/order-line/order-line.model';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';
import { Order } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { Product } from 'app/entities/product/product.model';
import { StockService } from 'app/entities/stock/service/stock.service';
import { Stock } from 'app/entities/stock/stock.model';
import { User } from 'app/entities/user/user.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public login: string | undefined | null;
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/myCart');
  private shoppingCart = new BehaviorSubject<Order | null>(null);
  private shoppingCartStocks = new BehaviorSubject<Stock[]>([]);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private orderLineService: OrderLineService,
    private accountService: AccountService,
    private stockService: StockService,
    private httpclient: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountRes => {
        if (!this.login && accountRes) {
          this.login = accountRes.login;
          const order = this.shoppingCart.getValue();
          if (order) {
            order.purchased = false;
            order.owner = new User(-1, accountRes.login);
            this.orderService.create(order).subscribe(orderRes => {
              order.id = orderRes.body?.id;
              this.shoppingCart.next(order);
            });
          } else {
            this.httpclient.get<Order | null>(this.resourceUrl).subscribe(
              res => {
                window.console.debug(res);
                this.shoppingCart.next(res);
                this.fetchStock();
              },
              err => window.console.error(err)
            );
          }
        }
        if (this.login && !accountRes) {
          this.shoppingCart.next(null);
        }
        this.login = accountRes?.login;
      });
  }

  get cart(): Observable<Order | null> {
    return this.shoppingCart;
  }

  get cartStock(): Observable<Stock[]> {
    return this.shoppingCartStocks;
  }

  productLeftInStock(stock: Stock): number {
    const inCart = this.shoppingCart.getValue()?.orderLines?.find(ol => ol.product?.id === stock.product?.id)?.quantity ?? 0;
    return (stock.stock ?? 15) - inCart;
  }

  get numberOfItems(): number {
    if (!this.shoppingCart.getValue()) {
      return 0;
    }
    const curValue = this.shoppingCart.getValue()?.orderLines;

    return curValue ? curValue.reduce((acc, cur) => (cur.quantity ? acc + cur.quantity : acc), 0) : 0;
  }

  get totalPrice(): number {
    if (!this.shoppingCart.getValue()) {
      return 0;
    }
    const curValue = this.shoppingCart.getValue()?.orderLines;

    return curValue
      ? curValue.reduce((acc, cur) => {
          if (cur.quantity && cur.product?.price) {
            return acc + cur.quantity * cur.product.price;
          }
          return acc;
        }, 0)
      : 0;
  }

  fetchStock(): void {
    this.shoppingCartStocks.next([]);
    this.shoppingCart.getValue()?.orderLines?.forEach(ol => {
      if (ol.product?.id !== undefined) {
        this.stockService.find(ol.product.id).subscribe(res => {
          if (res.body) {
            this.shoppingCartStocks.next([...this.shoppingCartStocks.getValue(), res.body]);
            if (!res.body.stock || res.body.stock < ol.quantity!) {
              throw new Error('Not enough stock ' + (ol.product?.name ? 'for product ' + ol.product.name + ' !' : 'for a product !'));
            }
          }
        });
      }
    });
  }

  addToCart(stock: Stock, quantity = 1): void {
    const product = stock.product!;

    if (!this.shoppingCart.getValue()) {
      this.createOrderAndAdd(stock, quantity);
      return;
    }

    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (this.login && !this.shoppingCart.getValue()?.id) {
      window.console.debug(this.shoppingCart.getValue());
      throw new Error('Invalid Order');
    }

    let returnArray: OrderLine[] = [];
    if (cartArray) {
      returnArray = cartArray;
      const alreadyInId = cartArray.findIndex(ol => (ol.product?.id !== undefined ? product.id === ol.product.id : false));

      if (alreadyInId >= 0) {
        const itemQuantity = cartArray[alreadyInId].quantity;
        cartArray[alreadyInId].quantity = itemQuantity ? itemQuantity + quantity : quantity;

        // TODO gestion erreur

        if (this.login) {
          this.orderLineService.partialUpdate(cartArray[alreadyInId]).subscribe(
            () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray }),
            error => window.console.error(error)
          );
          return;
        }
        this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray });
        return;
      }
    }
    this.shoppingCartStocks.next([...this.shoppingCartStocks.getValue(), stock]);
    const newOL = new OrderLine(undefined, quantity, product);

    if (this.login) {
      this.orderLineService.createWithOrderId(newOL, this.shoppingCart.getValue()?.id as number).subscribe(
        createdOL => {
          if (createdOL.body) {
            returnArray.push(createdOL.body);
            this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: returnArray });
          }
        },
        err => console.error(err)
      );
      return;
    }
    returnArray.push(newOL);
    this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: returnArray });
  }

  removeOneFromCart(product: Product): void {
    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (this.login && !this.shoppingCart.getValue()?.id) {
      throw new Error('Invalid Order');
    }
    if (!cartArray) {
      throw new Error('Cart empty');
    }

    const alreadyInId = cartArray.findIndex(ol => (ol.product?.id ? product.id === ol.product.id : false));
    if (alreadyInId < 0) {
      return;
    }

    const itemQuantity = cartArray[alreadyInId].quantity;
    if (!itemQuantity || itemQuantity <= 1) {
      this.deleteFromCart(product);
      return;
    }

    cartArray[alreadyInId].quantity = itemQuantity - 1;
    // TODO gestion erreur
    if (this.login) {
      this.orderLineService.partialUpdate(cartArray[alreadyInId]).subscribe(
        () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray }),
        error => window.console.error(error)
      );
      return;
    }
    this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray });
  }

  deleteFromCart(product: Product): void {
    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (this.login && !this.shoppingCart.getValue()?.id) {
      throw new Error('Invalid Order');
    }
    if (!cartArray) {
      throw new Error('Cart empty');
    }

    const alreadyInId = cartArray.findIndex(ol => (ol.product?.id ? product.id === ol.product.id : false));
    if (alreadyInId < 0) {
      return;
    }

    this.shoppingCartStocks.next(this.shoppingCartStocks.getValue().filter(st => st.product?.id !== product.id));
    const olId = cartArray[alreadyInId].id;
    if (olId) {
      this.orderLineService.delete(olId).subscribe(
        () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray.filter(ol => ol.id !== olId) }),
        error => window.console.error(error)
      );
    }
    if (!this.login) {
      const productId = cartArray[alreadyInId].product?.id;
      this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray.filter(ol => ol.product?.id !== productId) });
    }

    const numberOfLines = this.shoppingCart.getValue()?.orderLines?.length;
    if (numberOfLines && numberOfLines < 1) {
      this.discard();
    }
  }

  discard(discardApi = true): void {
    const orderId = this.shoppingCart.getValue()?.id;
    if (orderId && discardApi) {
      this.orderService.delete(orderId);
    }
    this.shoppingCartStocks.next([]);
    this.shoppingCart.next(null);
  }

  async isCartDeleted(): Promise<boolean> {
    if (!this.login) {
      return false;
    }
    const myCart = await this.httpclient.get<Order | null>(this.resourceUrl).toPromise();

    return myCart === null;
  }

  validate(billingAddress: Address): void {
    const order = this.shoppingCart.getValue();
    if (order) {
      order.billingAddress = billingAddress;
      order.purchasePrice = this.totalPrice;
      order.purchased = true;
      this.orderService.partialUpdate(order).subscribe(
        () => this.discard(),
        err => window.console.error(err)
      );
    } else {
      window.console.debug(this.shoppingCart.getValue());
      throw new Error('Invalid Order');
    }
  }

  private createOrderAndAdd(stock: Stock, quantity: number): void {
    const order = new Order();
    order.purchased = false;

    if (this.login) {
      order.owner = new User(-1, this.login);
      this.orderService.create(order).subscribe(orderRes => {
        order.id = orderRes.body?.id;
        this.shoppingCart.next(order);
        this.addToCart(stock, quantity);
      });
    } else {
      this.shoppingCart.next(order);
      this.addToCart(stock, quantity);
    }
  }
}
