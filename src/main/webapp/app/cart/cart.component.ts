import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'app/delete-dialog/delete-dialog.component';
import { Product } from 'app/entities/product/product.model';
import { CartItem, CartService } from './cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[];

  constructor(private cartService: CartService, private router: Router, public dialog: MatDialog) {
    // donothing
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  removeOneFromCart(product: Product): void {
    this.cartService.removeOneFromCart(product);
  }

  deleteFromCart(product: Product): void {
    this.cartService.deleteFromCart(product);
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe(cartItems => (this.cartItems = cartItems));
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
