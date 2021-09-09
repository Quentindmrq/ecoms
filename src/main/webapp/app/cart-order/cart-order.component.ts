import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.scss'],
})
export class CartOrderComponent implements OnInit {
  private tmp = 0;
  constructor() {
    //donothing
  }

  ngOnInit(): void {
    this.tmp = 0;
  }
}
