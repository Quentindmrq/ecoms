import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'app/entities/stock/service/stock.service';
import { Stock } from 'app/entities/stock/stock.model';
import { CartService } from 'app/cart/cart.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @Input() public req?: Record<string, unknown>;
  @Input() public title?: string;
  page: number;
  dataSource: MatTableDataSource<any>;
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
        if (stockRes.body?.content) {
          this.products.push(...stockRes.body.content);
          this.dataSource = new MatTableDataSource(this.products);
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
        if (stockRes.body?.content) {
          this.products.push(...stockRes.body.content);
          this.dataSource = new MatTableDataSource(this.products);
        }
        this.loadingPages = false;
      },
      error => {
        this.error = error;
        this.loadingPages = false;
      }
    );
  }

  private get request(): Record<string, unknown> {
    const newReq: Record<string, unknown> = { ...this.req, page: this.page };
    return newReq;
  }

  addToCart(stock: Stock): void {
    if (stock.product) {
      this.cartService.addToCart(stock.product);
    }
  }

  sortData(sort: Sort): void {
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = new MatTableDataSource(data);
      return;
    }

    this.dataSource = new MatTableDataSource(
      data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';

        switch (sort.active) {
          case 'name':
            return this.compare(a.product?.name, b.product?.name, isAsc);
          case 'price':
            return this.compare(a.product?.price, b.product?.price, isAsc);
          case 'stock':
            return this.compare(a.stock, b.stock, isAsc);
          default:
            return 0;
        }
      })
    );
  }

  compare(a: number | string | null | undefined, b: number | string | null | undefined, isAsc: boolean): number {
    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
