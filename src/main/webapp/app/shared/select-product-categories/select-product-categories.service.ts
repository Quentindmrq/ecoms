import { Injectable } from '@angular/core';
import { Game } from 'app/entities/enumerations/game.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectProductCategoriesService {
  private selectedGamesBH = new BehaviorSubject<Game | null>(null);
  private selectedProductTypesBH = new BehaviorSubject<ProductType[]>([]);

  constructor() {
    // donothing
  }

  updateGames(games: Game | null): void {
    this.selectedGamesBH.next(games);
  }
  updateProductType(productTypes: ProductType[]): void {
    this.selectedProductTypesBH.next(productTypes);
  }

  get selectedGames(): Observable<Game | null> {
    return this.selectedGamesBH;
  }
  get selectedProductTypes(): Observable<ProductType[]> {
    return this.selectedProductTypesBH;
  }
}
