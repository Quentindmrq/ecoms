import { Component, OnInit } from '@angular/core';
import { Address } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.scss'],
})
export class CartOrderComponent implements OnInit {
  model: Address;
  constructor() {
    //donothing
  }

  ngOnInit(): void {
    this.model = new Address();
  }

  onSubmit(): void {
    //TODO -- envoyer a l api
    window.console.debug(this.model);
  }
}
