import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'app/entities/product/product.model';
import { CartItem, CartService } from './cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[];

  constructor(private cartService: CartService, private router: Router) {
    // donothing
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  removeOneFromCart(product: Product): void {
    this.cartService.removeOneFromCart(product);
  }

  deleteFromCart(product: Product): void {
    this.cartService.deleteFromCart(product);
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe(cartItems => (this.cartItems = cartItems));
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }

  discard(): void {
    return this.cartService.discard();
  }

  validate(): void {
    window.console.debug('cart-validate');
    this.router.navigate(['/shopping-tunnel']);
  }
}
