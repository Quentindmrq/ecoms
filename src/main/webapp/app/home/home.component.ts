import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { SelectProductCategoriesService } from 'app/shared/select-product-categories/select-product-categories.service';
import { Game } from 'app/entities/enumerations/game.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { NonNullChain } from 'typescript';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  public Games = Game;
  selectedGames: Game | null;
  public ProductTypes = Object.values(ProductType);
  selectedProductTypes: ProductType[];

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private selectProdCat: SelectProductCategoriesService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.selectProdCat.selectedGames.subscribe(games => (this.selectedGames = games));
    this.selectProdCat.selectedProductTypes.subscribe(productTypes => (this.selectedProductTypes = productTypes));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get productTypeToShow(): ProductType[] {
    return this.selectedProductTypes.length > 0 ? this.selectedProductTypes : this.ProductTypes;
  }
}
