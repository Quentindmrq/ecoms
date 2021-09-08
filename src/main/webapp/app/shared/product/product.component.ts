import { Subject } from 'rxjs';

import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Product } from 'app/entities/product/product.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  account: Account | null = null;

  @Input() public product: Product;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService) {
    // donothing
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  @HostListener('click') onClick(): void {
    let cart: Array<number>;
    let tmp: any;
    if ((tmp = sessionStorage.getItem('cart')) != null) {
      cart = JSON.parse(tmp);
      if ((tmp = this.product.id) != null) {
        cart.push(tmp);
        sessionStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  }
}
