import { IProduct } from 'app/entities/product/product.model';

export interface IStock {
  id?: number;
  stock?: number | null;
  version?: number | null;
  product?: IProduct | null;
}

export class Stock implements IStock {
  constructor(public id?: number, public stock?: number | null, public version?: number | null, public product?: IProduct | null) {}
}

export function getStockIdentifier(stock: IStock): number | undefined {
  return stock.id;
}
