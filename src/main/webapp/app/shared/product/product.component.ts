import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CartService } from 'app/cart/cart.service';
import { Product } from 'app/entities/product/product.model';
import { Stock } from 'app/entities/stock/stock.model';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Input() public stock: Stock;

  constructor(private cartService: CartService) {
    // donothing
  }

  addToCart(): void {
    if (this.stock.product) {
      this.cartService.addToCart(this.stock.product);
    }
  }
}
