import { Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Address } from 'app/entities/address/address.model';
import { OrderLine } from 'app/entities/order-line/order-line.model';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';
import { Order } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { Product } from 'app/entities/product/product.model';
import { User } from 'app/entities/user/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private shoppingCart = new BehaviorSubject<Order | null>(null);

  constructor(private orderService: OrderService, private orderLineService: OrderLineService, private accountService: AccountService) {}

  get cart(): Observable<Order | null> {
    return this.shoppingCart;
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

  addToCart(product: Product, quantity = 1): void {
    if (!this.shoppingCart.getValue()) {
      this.createOrder();
    }

    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (!this.shoppingCart.getValue()?.id) {
      window.console.debug(this.shoppingCart.getValue());
      throw new Error('Invalid Order');
    }
    let returnArray: OrderLine[] = [];
    if (cartArray) {
      returnArray = cartArray;
      const alreadyInId = cartArray.findIndex(ol => (ol.product?.id ? product.id === ol.product.id : false));
      if (alreadyInId >= 0) {
        const itemQuantity = cartArray[alreadyInId].quantity;
        cartArray[alreadyInId].quantity = itemQuantity ? itemQuantity + quantity : quantity;
        // TODO gestion erreur
        this.orderLineService.partialUpdate(cartArray[alreadyInId]).subscribe(
          () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray }),
          error => window.console.error(error)
        );
        return;
      }
    }
    const newOL = new OrderLine(undefined, quantity, product);
    this.orderLineService.createWithOrderId(newOL, this.shoppingCart.getValue()?.id as number).subscribe(
      createdOL => {
        if (createdOL.body) {
          returnArray.push(createdOL.body);
          this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: returnArray });
        }
      },
      err => console.error(err)
    );
  }

  removeOneFromCart(product: Product): void {
    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (!this.shoppingCart.getValue()?.id) {
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
    this.orderLineService.partialUpdate(cartArray[alreadyInId]).subscribe(
      () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray }),
      error => window.console.error(error)
    );
    return;
  }

  deleteFromCart(product: Product): void {
    const cartArray = this.shoppingCart.getValue()?.orderLines?.slice();
    if (!this.shoppingCart.getValue()?.id) {
      throw new Error('Invalid Order');
    }
    if (!cartArray) {
      throw new Error('Cart empty');
    }

    const alreadyInId = cartArray.findIndex(ol => (ol.product?.id ? product.id === ol.product.id : false));
    if (alreadyInId < 0) {
      return;
    }

    const olId = cartArray[alreadyInId].id;
    if (olId) {
      this.orderLineService.delete(olId).subscribe(
        () => this.shoppingCart.next({ ...this.shoppingCart.getValue(), orderLines: cartArray.filter(ol => ol.id !== olId) }),
        error => window.console.error(error)
      );
    }

    const numberOfLines = this.shoppingCart.getValue()?.orderLines?.length;
    if (numberOfLines && numberOfLines < 1) {
      this.discard();
    }
  }

  discard(): void {
    const orderId = this.shoppingCart.getValue()?.id;
    if (orderId) {
      this.orderService.delete(orderId);
    }
    this.shoppingCart.next(null);
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

  private createOrder(): void {
    const order = new Order();

    let login: string | undefined;
    this.accountService.identity().subscribe(accountRes => (login = accountRes?.login));

    if (login) {
      order.owner = new User(-1, login);
      order.purchased = false;
      this.orderService.create(order).subscribe(orderRes => (order.id = orderRes.body?.id));
      this.shoppingCart = new BehaviorSubject<Order | null>(order);
    }
  }
}
