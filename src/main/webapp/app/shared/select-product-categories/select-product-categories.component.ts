import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'app/entities/enumerations/game.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { SelectProductCategoriesService } from './select-product-categories.service';

@Component({
  selector: 'jhi-select-product-categories',
  templateUrl: './select-product-categories.component.html',
  styleUrls: ['./select-product-categories.component.scss'],
})
export class SelectProductCategoriesComponent implements OnInit {
  public Games = Game;
  games: Game;
  public ProductTypes = ProductType;
  productTypes: ProductType[];

  constructor(private selectProductCategoriesServ: SelectProductCategoriesService, private router: Router) {
    // TODO
  }

  ngOnInit(): void {
    this.selectProductCategoriesServ.selectedGames.subscribe(games => (this.games = games));
    this.selectProductCategoriesServ.selectedProductTypes.subscribe(productTypes => (this.productTypes = productTypes));
  }

  updateGames(value: Game): void {
    this.router.navigate(['/game/' + value.toLocaleLowerCase()]);
  }

  updateProductTypes(productType: ProductType): void {
    if (this.productTypes.includes(productType)) {
      this.selectProductCategoriesServ.removeProductType(productType);
      return;
    }
    this.selectProductCategoriesServ.updateProductType(productType);
  }
}
