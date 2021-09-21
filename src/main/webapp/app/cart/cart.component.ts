import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'app/delete-dialog/delete-dialog.component';
import { OrderLine } from 'app/entities/order-line/order-line.model';
import { Order } from 'app/entities/order/order.model';
import { Product } from 'app/entities/product/product.model';
import { CartService } from './cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Order | null;

  constructor(private cartService: CartService, private router: Router, public dialog: MatDialog) {
    // donothing
  }

  addToCart(ol: OrderLine): void {
    if (ol.product) {
      this.cartService.addToCart(ol.product);
      return;
    }
    window.console.error('Invalid product');
  }

  removeOneFromCart(ol: OrderLine): void {
    if (ol.product) {
      this.cartService.removeOneFromCart(ol.product);
      return;
    }
    window.console.error('Invalid product');
  }

  deleteFromCart(ol: OrderLine): void {
    if (ol.product) {
      this.cartService.deleteFromCart(ol.product);
      return;
    }
    window.console.error('Invalid product');
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe(cartItems => (this.cart = cartItems));
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }

  discard(): void {
    return this.cartService.discard();
  }

  validate(): void {
    window.console.debug('cart-validate');
    this.router.navigate(['/shopping-tunnel']);
  }

  get orderLines(): OrderLine[] {
    return this.cart?.orderLines ? this.cart.orderLines : [];
  }

  getPrice(ol: OrderLine): number | string {
    if (ol.product?.price && ol.quantity) {
      return ol.product.price * ol.quantity;
    }
    return 0.0;
  }

  get login(): string | null | undefined {
    return this.cartService.login;
  }

  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        content: `Are ou sure you want to delete ${product.name ? product.name : 'this product'} from your cart ?`,
        trueButton: 'Delete',
        falseButton: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteFromCart(product);
      }
    });
  }
}
