import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  @Input() public productType?: ProductType;
  @Input() public game?: Game;

  pageInfo: PageableResponse<IStock> | null;
  page: number;
  dataSource: MatTableDataSource<Stock>;
  loadingPages: boolean;
  error?: any;
  products: Stock[];

  constructor(private stockService: StockService, private cartService: CartService) {}

  ngOnChanges(changes: any): void {
    if (changes.game) {
      this.page = 1;
      this.loadingPages = true;
      this.products = [];

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
    this.page++;
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

  addToCart(stock: Stock): void {
    if (stock.product) {
      this.cartService.addToCart(stock.product);
    }
  }

  private get request(): Record<string, unknown> {
    const newReq: Record<string, unknown> = { ...this.req, page: this.page, game: this.game, type: this.productType };
    return newReq;
  }
}
