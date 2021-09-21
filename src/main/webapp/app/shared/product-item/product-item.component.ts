import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'app/cart/cart.service';
import { Product } from 'app/entities/product/product.model';
import { Stock } from 'app/entities/stock/stock.model';

@Component({
  selector: 'jhi-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  @Input() public stock: Stock;
  itemsInCart = 0;

  constructor(private cartService: CartService, private router: Router) {
    // donothing
  }

  addToCart(): void {
    if (this.stock.product) {
      this.cartService.addToCart(this.stock);
    }
  }

  goToProduct(): void {
    this.router.navigate(['/product/', this.product?.id]);
  }
  get product(): Product | null | undefined {
    return this.stock.product;
  }

  get productLeftInStock(): number {
    return this.cartService.productLeftInStock(this.stock);
  }
}
