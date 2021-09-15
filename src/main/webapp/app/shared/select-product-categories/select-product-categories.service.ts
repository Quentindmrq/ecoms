import { Injectable } from '@angular/core';
import { Game } from 'app/entities/enumerations/game.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectProductCategoriesService {
  private selectedGamesBH = new BehaviorSubject<Game>(Game.LEAGUE_OF_LEGENDS);
  private selectedProductTypesBH = new BehaviorSubject<ProductType[]>([]);

  constructor() {
    // donothing
  }

  updateGame(games: Game): void {
    this.selectedGamesBH.next(games);
    this.resetProductType();
  }
  updateProductType(productType: ProductType): void {
    this.selectedProductTypesBH.next([productType]);
  }
  resetProductType(): void {
    this.selectedProductTypesBH.next([]);
  }
  removeProductType(productType: ProductType): void {
    this.selectedProductTypesBH.next([...this.selectedProductTypesBH.getValue().filter(pt => pt !== productType)]);
  }

  get selectedGames(): Observable<Game> {
    return this.selectedGamesBH;
  }
  get selectedProductTypes(): Observable<ProductType[]> {
    return this.selectedProductTypesBH;
  }
}
