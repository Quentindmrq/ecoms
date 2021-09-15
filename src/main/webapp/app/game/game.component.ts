import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Game } from 'app/entities/enumerations/game.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { SelectProductCategoriesService } from 'app/shared/select-product-categories/select-product-categories.service';

@Component({
  selector: 'jhi-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  selectedGame: Game;
  public ProductTypes = Object.values(ProductType);
  selectedProductTypes: ProductType[];
  loading: boolean;
  error: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private selectProdCat: SelectProductCategoriesService) {
    // TODO
  }

  ngOnInit(): void {
    this.selectProdCat.selectedGames.subscribe(game => (this.selectedGame = game));
    this.selectProdCat.selectedProductTypes.subscribe(productTypes => (this.selectedProductTypes = productTypes));

    this.loading = true;
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        const gameParam: string = params['game'].toLocaleUpperCase();
        if (Object.keys(Game).includes(gameParam)) {
          this.selectProdCat.updateGame(gameParam as Game);
        } else {
          window.console.log(Object.keys(Game), gameParam);
        }
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  get productTypeToShow(): ProductType[] {
    return this.selectedProductTypes.length > 0 ? this.selectedProductTypes : this.ProductTypes;
  }
}
