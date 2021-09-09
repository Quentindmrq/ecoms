import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  ngOnInit(): void {
    this.cartService.cart.subscribe(cartItems => (this.cartItems = cartItems));
  }

  discard(): void {
    window.console.debug('cart-discard');
  }

  validate(): void {
    window.console.debug('cart-validate');
    this.router.navigate(['/shopping-tunnel']);
  }
}
