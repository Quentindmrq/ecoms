import { Component, OnInit } from '@angular/core';
import { Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss'],
})
export class PanierComponent implements OnInit {
  products: Product[];
  totalAmount = 0.0;

  constructor(private productService: ProductService) {
    // donothing
  }

  ngOnInit(): void {
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
  }
}
