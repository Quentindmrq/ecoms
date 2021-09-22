import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CartService } from 'app/cart/cart.service';
import { StockService } from 'app/entities/stock/service/stock.service';
import { Stock } from 'app/entities/stock/stock.model';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnChanges {
  productId: number;
  stock: Stock | null;
  loading: boolean;
  error: any;
  numberOfItems = 1;
  stockArray: number[];
  constructor(private activatedRoute: ActivatedRoute, private stockService: StockService, private cartService: CartService) {}

  ngOnChanges(changes: any): void {
    window.console.debug(changes);
  }

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
        this.stockArray = Array(Math.min(this.productLeftInStock, 15))
          .fill(0)
          .map((x, i) => i + 1); // [0,1,2,3,4]
      },

      error => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  get productLeftInStock(): number {
    return this.cartService.productLeftInStock(this.stock!);
  }

  addToCart(): void {
    if (this.stock?.product) {
      this.cartService.addToCart(this.stock, this.numberOfItems);
    } else {
      this.error = "Can't add to cart, product null or undef";
    }
  }
}
