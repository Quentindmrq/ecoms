import { IStock } from 'app/entities/stock/stock.model';
import { Game } from 'app/entities/enumerations/game.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';

export interface IProduct {
  id?: number;
  name?: string | null;
  description?: string | null;
  logo?: string | null;
  price?: number | null;
  game?: Game | null;
  productType?: ProductType | null;
  stock?: IStock | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public logo?: string | null,
    public price?: number | null,
    public game?: Game | null,
    public productType?: ProductType | null,
    public stock?: IStock | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
