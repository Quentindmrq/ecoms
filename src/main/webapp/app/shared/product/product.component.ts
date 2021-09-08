import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Product } from 'app/entities/product/product.model';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() public product: Product;

  constructor() {
    // donothing
  }

  ngOnInit(): void {
    // TODO
  }

  @HostListener('click') onClick(): void {
    // TODO
  }
}
