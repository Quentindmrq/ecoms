import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'app/entities/stock/service/stock.service';
import { IStock, Stock } from 'app/entities/stock/stock.model';
import { CartService } from 'app/cart/cart.service';
import { MatSort } from '@angular/material/sort';
import { PageableResponse } from 'app/entities/common/pageablehttpresponse.model';
import { Product } from 'app/entities/product/product.model';
import { isBreakOrContinueStatement } from 'typescript';

@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() public req?: Record<string, unknown>;
  @Input() public title?: string;

  pageInfo: PageableResponse<IStock> | null;
  page: number;
  dataSource: MatTableDataSource<Stock>;
  loadingPages: boolean;
  error?: any;
  displayedColumns: string[] = ['name', 'price', 'description', 'stock', ' '];
  private products: Stock[];

  constructor(private stockService: StockService, private cartService: CartService) {}

  ngOnInit(): void {
    this.page = 1;
    this.loadingPages = true;
    this.products = [];
    this.stockService.query(this.request).subscribe(
      stockRes => {
        this.pageInfo = stockRes.body;
        if (stockRes.body?.content) {
          this.products.push(...stockRes.body.content);
          this.updateDataSource();
        }
        this.loadingPages = false;
      },
      error => {
        this.error = error;
        this.loadingPages = false;
      }
    );
  }

  loadNewPage(): void {
    this.page++;
    this.loadingPages = true;

    this.stockService.query(this.request).subscribe(
      stockRes => {
        this.pageInfo = stockRes.body;
        if (stockRes.body?.content) {
          this.products.push(...stockRes.body.content);
          this.updateDataSource();
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
    const newReq: Record<string, unknown> = { ...this.req, page: this.page };
    return newReq;
  }
  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource.sortingDataAccessor = (data: Stock, sortHeaderId: string): string | number => {
      switch (sortHeaderId) {
        case 'price':
          return data.product?.price ? data.product.price : 'N/A';
        case 'name':
          return data.product?.name ? data.product.name : 'N/A';
        case 'stock':
          return data.stock ? data.stock : 'N/A';
        default:
          return 'N/A';
      }
    };
    this.dataSource.sort = this.sort;
  }
}
