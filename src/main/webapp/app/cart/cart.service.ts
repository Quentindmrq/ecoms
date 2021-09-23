import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DeleteDialogComponent } from 'app/delete-dialog/delete-dialog.component';
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
    protected applicationConfigService: ApplicationConfigService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountRes => {
        if (!this.login && accountRes) {
          // user is login in
          this.login = accountRes.login;
          const order = this.shoppingCart.getValue();
          if (order) {
            // Has already items is Cart
            order.purchased = 0;
            order.owner = new User(-1, accountRes.login);
            this.orderService.create(order).subscribe(orderRes => {
              order.id = orderRes.body?.id;
              this.shoppingCart.next(order);
            });
          } else {
            // Cart empty so we load the one saved
            this.httpclient.get<Order | null>(this.resourceUrl).subscribe(
              res => {
                window.console.debug(res);
                this.shoppingCart.next(res);
                this.fetchStock();
              },
              err => {
                if (err.status !== 404) {
                  window.console.error(err);
                }
              }
            );
          }
        }
        // User is login out
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
    if (this.login) {
      return stock.stock ?? 15;
    }
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
          }
        });
      }
    });
  }

  addToCart(product: Product, quantity = 1): void {
    if (!this.shoppingCart.getValue()) {
      this.createOrderAndAdd(product, quantity);
      return;
    }

    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (this.login && !this.shoppingCart.getValue()?.id) {
      throw new Error('Invalid Order');
    }

    let returnArray: OrderLine[] = [];
    if (cartArray) {
      returnArray = cartArray;
      const alreadyInId = cartArray.findIndex(ol => (ol.product?.id !== undefined ? product.id === ol.product.id : false));

      if (alreadyInId >= 0) {
        const itemQuantity = cartArray[alreadyInId].quantity;
        cartArray[alreadyInId].quantity = itemQuantity ? itemQuantity + quantity : quantity;

        if (this.login) {
          this.orderLineService.partialUpdate(cartArray[alreadyInId]).subscribe(
            () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray }),
            err => {
              if (err.error.errorKey === 'idnotfound') {
                this.openCartDeletedDialog();
              }
            }
          );
          return;
        }
        this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray });
        return;
      }
    }
    const newOL = new OrderLine(undefined, quantity, product);

    if (this.login) {
      this.orderLineService.createWithOrderId(newOL, this.shoppingCart.getValue()?.id as number).subscribe(
        createdOL => {
          if (createdOL.body) {
            returnArray.push(createdOL.body);
            this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: returnArray });
          }
        },
        err => {
          if (err.error.errorKey === "order doesn't exists") {
            this.openCartDeletedDialog();
          }
        }
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

    const alreadyInId = cartArray.findIndex(ol => (ol.product?.id !== undefined ? product.id === ol.product.id : false));
    if (alreadyInId < 0) {
      throw new Error('Product not found in cart');
    }

    const itemQuantity = cartArray[alreadyInId].quantity;
    if (!itemQuantity || itemQuantity <= 1) {
      // Product with 0 quantity so we delete it
      this.deleteFromCart(product);
      return;
    }

    cartArray[alreadyInId].quantity = itemQuantity - 1;
    if (this.login) {
      // If logged in we patch the database
      this.orderLineService.partialUpdate(cartArray[alreadyInId]).subscribe(
        () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray }),
        error => window.console.error(error)
      );
      return;
    }
    // We update the BehSub
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

    const alreadyInId = cartArray.findIndex(ol => (ol.product?.id !== undefined ? product.id === ol.product.id : false));
    if (alreadyInId < 0) {
      throw new Error('Product not found in cart');
    }

    const olId = cartArray[alreadyInId].id;
    if (olId) {
      // We delete the orderLine in the database

      this.orderLineService.delete(olId).subscribe(
        () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray.filter(ol => ol.id !== olId) }),
        error => window.console.error(error)
      );
    }
    if (!this.login) {
      // We update only the BehSub when not loged in
      const productId = cartArray[alreadyInId].product?.id;
      this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray.filter(ol => ol.product?.id !== productId) });
    }

    const numberOfLines = this.shoppingCart.getValue()?.orderLines?.length;
    if (numberOfLines && numberOfLines < 1) {
      // We delete the order if there is no orderLine in it
      this.discard();
    }
  }

  discard(discardApi = true): void {
    const orderId = this.shoppingCart.getValue()?.id;
    if (orderId && discardApi) {
      this.orderService.delete(orderId).subscribe(
        () => {
          this.shoppingCartStocks.next([]);
          this.shoppingCart.next(null);
        },
        error => window.console.error(error)
      );
      return;
    }
    this.shoppingCartStocks.next([]);
    this.shoppingCart.next(null);
  }

  validate(billingAddress: Address): void {
    const order = this.shoppingCart.getValue();
    if (order) {
      order.billingAddress = billingAddress;
      order.purchasePrice = this.totalPrice;
      order.purchased = 1;
      this.orderService.partialUpdate(order).subscribe(
        () => this.discard(false),
        err => window.console.error(err)
      );
    } else {
      throw new Error('Invalid Order');
    }
  }

  async isCartDeleted(): Promise<boolean> {
    if (!this.login) {
      return false;
    }

    let returnValue = false;

    await this.httpclient
      .get<Order | null>(this.resourceUrl)
      .toPromise()
      .catch(err => {
        if (err.status === 404) {
          returnValue = true;
        }
      });

    return returnValue;
  }

  getUnavailableItems(): OrderLine[] {
    if (this.login) {
      return [];
    }

    const orderLines = this.shoppingCart.getValue()?.orderLines;

    if (!orderLines) {
      throw new Error('Invalid Order');
    }

    return orderLines.filter(ol => {
      if (Number.isNaN(ol.product?.id)) {
        throw new Error('Invalid product in cart');
      }

      if (Number.isNaN(ol.quantity)) {
        throw new Error('Invalid product quantity in cart');
      }

      const stock = this.shoppingCartStocks.getValue().find(st => st.product!.id === ol.product?.id);

      if (!stock) {
        throw new Error('Missing stock in cart');
      }

      if (Number.isNaN(stock.stock)) {
        throw new Error('Invalid stock in cart');
      }

      return ol.quantity! > stock.stock!;
    });
  }

  openCartDeletedDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        content: `Your cart was deleted due to inactivity ! You will be redirected to the Homepage`,
        trueButton: 'Close',
        trueButtonColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.discard(false);
      this.router.navigate(['/']);
    });
  }

  private createOrderAndAdd(product: Product, quantity: number): void {
    const order = new Order();
    order.purchased = 0;

    if (this.login) {
      order.owner = new User(-1, this.login);
      this.orderService.create(order).subscribe(orderRes => {
        order.id = orderRes.body?.id;
        this.shoppingCart.next(order);
        this.addToCart(product, quantity);
      });
    } else {
      this.shoppingCart.next(order);
      this.addToCart(product, quantity);
    }
  }
}
