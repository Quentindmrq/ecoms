import { Component, OnInit } from '@angular/core';
import { Product } from 'app/entities/product/product.model';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  products: Product[];
  totalAmount = 0.0;

  constructor() {
    // donothing
  }

  ngOnInit(): void {
    this.totalAmount = 0.0;

    /*
    let cart: Array<number>;
    let tmp: any;
    if ((tmp = sessionStorage.getItem('cart')) != null) {
      cart = JSON.parse(tmp);

      cart.forEach(id =>
        this.productService.find(id).subscribe(findRes => {
          if (findRes.body != null) {
            this.products.push(findRes.body);

            if (findRes.body.price != null) {
              this.totalAmount += findRes.body.price;
            }
          }
        })
      );
    }
    */
  }
}
