import { IProduct } from 'app/entities/product/product.model';
import { IOrder } from 'app/entities/order/order.model';

export interface IOrderLine {
  id?: number;
  quantity?: number | null;
  product?: IProduct | null;
  order?: IOrder | null;
}

export class OrderLine implements IOrderLine {
  constructor(public id?: number, public quantity?: number | null, public product?: IProduct | null, public order?: IOrder | null) {}
}

export function getOrderLineIdentifier(orderLine: IOrderLine): number | undefined {
  return orderLine.id;
}
