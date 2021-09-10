import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {
    // donothing
  }

  get cart(): Observable<CartItem[]> {
    return this.shoppingCart;
  }

  get numberOfItems(): number {
    return this.shoppingCart.getValue().length;
  }

  // TODO finir ajout quantité
  addToCart(product: Product /*, quantity: number*/): void {
    this.shoppingCart.next([...this.shoppingCart.getValue(), { product, quantity: 1 }]);
  }

  removeFromCart(product: Product): void {
    // TODO
  }
}
