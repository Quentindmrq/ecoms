import { Component, OnInit } from '@angular/core';
import { Product } from 'app/entities/product/product.model';
import { CartItem, CartService } from './cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[];

  constructor(private cartService: CartService) {
    // donothing
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe(cartItems => (this.cartItems = cartItems));
  }
}
