import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'app/entities/stock/service/stock.service';
import { Stock } from 'app/entities/stock/stock.model';
import { CartService } from 'app/cart/cart.service';

@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Stock[] | null;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'price', 'description', 'stock', ' '];

  constructor(private stockService: StockService, private cartService: CartService) {
    // TODO
  }

  ngOnInit(): void {
    this.stockService.query().subscribe(stockRes => {
      this.products = stockRes.body;
      if (this.products) {
        this.dataSource = new MatTableDataSource(this.products);
      }
    });
  }

  addToCart(stock: Stock): void {
    if (stock.product) {
      this.cartService.addToCart(stock.product);
    }
  }
}
