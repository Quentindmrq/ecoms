import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CartService } from 'app/cart/cart.service';
import { StockService } from 'app/entities/stock/service/stock.service';
import { Stock } from 'app/entities/stock/stock.model';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productId: number;
  stock: Stock | null;
  loading: boolean;
  error: any;
  constructor(private activatedRoute: ActivatedRoute, private stockService: StockService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.productId = params['id'];
        this.getProduct();
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  getProduct(): void {
    this.stockService.find(this.productId).subscribe(
      stockRes => {
        this.stock = stockRes.body;
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  addToCart(): void {
    if (this.stock?.product) {
      this.cartService.addToCart(this.stock.product);
    } else {
      this.error = "Can't add to cart, product null or undef";
    }
  }
}
