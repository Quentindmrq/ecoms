import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { StockService } from 'app/entities/stock/service/stock.service';
import { IStock, Stock } from 'app/entities/stock/stock.model';
import { CartService } from 'app/cart/cart.service';
import { MatSort } from '@angular/material/sort';
import { PageableResponse } from 'app/entities/common/pageablehttpresponse.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { Game } from 'app/entities/enumerations/game.model';

@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @Input() public req?: Record<string, unknown>;
  @Input() public showMoreButton = false;
  @Input() public productType?: ProductType;
  @Input() public game?: Game;

  pageInfo: PageableResponse<IStock> | null;
  loadingPages: boolean;
  error?: any;
  products: Stock[];

  constructor(private stockService: StockService, private cartService: CartService) {}

  ngOnChanges(changes: any): void {
    if (changes.game) {
      this.loadingPages = true;
      this.products = [];
      this.pageInfo = null;

      this.stockService.query(this.request).subscribe(
        stockRes => {
          this.pageInfo = stockRes.body;
          if (stockRes.body?.content) {
            this.products = stockRes.body.content;
          }
          this.loadingPages = false;
        },
        error => {
          this.error = error;
          this.loadingPages = false;
        }
      );
    }
  }

  loadNewPage(): void {
    if (!this.isLastPage) {
      this.loadingPages = true;

      this.stockService.query(this.request).subscribe(
        stockRes => {
          this.pageInfo = stockRes.body;
          if (stockRes.body?.content) {
            this.products.push(...stockRes.body.content);
          }
          this.loadingPages = false;
        },
        error => {
          this.error = error;
          this.loadingPages = false;
        }
      );
    }
  }

  addToCart(stock: Stock): void {
    if (stock.product) {
      this.cartService.addToCart(stock.product);
    }
  }

  get isLastPage(): boolean {
    return this.pageInfo?.last ?? false;
  }

  private get request(): Record<string, unknown> {
    const pageNumber = this.pageInfo?.number !== undefined ? this.pageInfo.number + 1 : 0;
    const newReq: Record<string, unknown> = { ...this.req, page: pageNumber, game: this.game, type: this.productType };
    return newReq;
  }
}
