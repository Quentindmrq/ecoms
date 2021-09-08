import { Component, OnInit } from '@angular/core';
import { StockService } from 'app/entities/stock/service/stock.service';
import { Stock } from 'app/entities/stock/stock.model';

@Component({
  selector: 'jhi-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Stock[] | null;

  constructor(private stockService: StockService) {
    // TODO
  }

  ngOnInit(): void {
    this.stockService.query().subscribe(stockRes => (this.products = stockRes.body));
  }
}
