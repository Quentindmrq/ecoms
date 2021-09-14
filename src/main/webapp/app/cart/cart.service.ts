import { Injectable } from '@angular/core';
import { Product } from 'app/entities/product/product.model';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private shoppingCart = new BehaviorSubject<CartItem[]>([]);

  /*
  private get totalAmount() {
    // TODO
  }
  */

  constructor() {
    // donothing
  }

  get cart(): Observable<CartItem[]> {
    return this.shoppingCart;
  }

  get numberOfItems(): number {
    return this.shoppingCart.getValue().reduce((acc, cur) => acc + cur.quantity, 0);
  }

  addToCart(product: Product, quantity = 1): void {
    const cartArray = this.shoppingCart.getValue().slice();
    const alreadyInId = cartArray.findIndex(stock => product.id === stock.product.id);
    if (alreadyInId < 0) {
      this.shoppingCart.next([...this.shoppingCart.getValue(), { product, quantity }]);
      return;
    }

    cartArray[alreadyInId].quantity += quantity;

    this.shoppingCart.next([...cartArray]);
  }

  removeOneFromCart(product: Product): void {
    const cartArray = this.shoppingCart.getValue().slice();
    const alreadyInId = cartArray.findIndex(stock => product.id === stock.product.id);
    if (alreadyInId < 0) {
      return;
    } else if (cartArray[alreadyInId].quantity <= 1) {
      this.deleteFromCart(product);
      return;
    }

    cartArray[alreadyInId].quantity = cartArray[alreadyInId].quantity - 1;

    this.shoppingCart.next([...cartArray]);
  }

  deleteFromCart(product: Product): void {
    const cartArrayFiltered = this.shoppingCart.getValue().filter(stock => product.id !== stock.product.id);
    this.shoppingCart.next([...cartArrayFiltered]);
  }
}
