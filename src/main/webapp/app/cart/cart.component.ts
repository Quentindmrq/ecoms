import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { DeleteDialogComponent } from 'app/delete-dialog/delete-dialog.component';
import { OrderLine } from 'app/entities/order-line/order-line.model';
import { Order } from 'app/entities/order/order.model';
import { Product } from 'app/entities/product/product.model';
import { Stock } from 'app/entities/stock/stock.model';
import { CartService } from './cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Order | null;
  cartStocks: Stock[];

  constructor(private cartService: CartService, private router: Router, public dialog: MatDialog, private accountService: AccountService) {
    // donothing
  }

  ngOnInit(): void {
    this.cartService.fetchStock();
    this.cartService.cart.subscribe(cartItems => (this.cart = cartItems));
    this.cartService.cartStock.subscribe(cartStocks => (this.cartStocks = cartStocks));
  }

  addToCart(ol: OrderLine): void {
    if (ol.product) {
      this.cartService.addToCart(ol.product);
      if (this.cartService.login) {
        const stockId = this.cartStocks.findIndex(st => st.product?.id === ol.product?.id);
        if (stockId !== -1) {
          this.cartStocks[stockId].stock!--;
        }
      }
      return;
    }
    window.console.error('Invalid product');
  }

  removeOneFromCart(ol: OrderLine): void {
    if (ol.product) {
      this.cartService.removeOneFromCart(ol.product);
      if (this.cartService.login) {
        const stockId = this.cartStocks.findIndex(st => st.product?.id === ol.product?.id);
        if (stockId !== -1) {
          this.cartStocks[stockId].stock!++;
        }
      }
      return;
    }
    window.console.error('Invalid product');
  }

  deleteFromCart(product: Product): void {
    this.cartService.deleteFromCart(product);
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }

  discard(): void {
    return this.cartService.discard();
  }

  validate(): void {
    if (!this.accountService.isAuthenticated()) {
      try {
        const unAv = this.cartService.getUnavailableItems();
        if (unAv.length > 0) {
          let msg = 'Not enough of the following items in Stock :';
          unAv.forEach(ol => {
            msg += ' ' + (ol.product?.name ?? '(missing name)');
          });
          this.openDialog(msg);
          return;
        }
      } catch (err) {
        this.openDialog((err as Error).message);
        return;
      }
      this.router.navigate(['/shopping-tunnel']);
    }

    this.cartService.isCartDeleted().then(status => {
      if (status) {
        this.openCartDeletedDialog();
      } else {
        this.router.navigate(['/shopping-tunnel']);
      }
    });
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

  productLeftInStock(producId: number): number {
    const stock = this.cartStocks.find(st => st.product?.id === producId);
    if (stock) {
      return this.cartService.productLeftInStock(stock);
    }
    return 0;
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

  openCartDeletedDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        content: `Your cart was deleted !`,
        trueButton: 'Go to the HomePage',
        trueButtonColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cartService.discard(false);
      this.router.navigate(['/']);
    });
  }

  openDialog(message: string): void {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        content: message,
        trueButton: 'Close',
        trueButtonColor: 'primary',
      },
    });
  }
}
