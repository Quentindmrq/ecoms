import * as dayjs from 'dayjs';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { IUser } from 'app/entities/user/user.model';
import { IAddress } from 'app/entities/address/address.model';

export interface IOrder {
  id?: number;
  purchased?: number | null;
  purchaseDate?: dayjs.Dayjs | null;
  purchasePrice?: number | null;
  orderLines?: IOrderLine[] | null;
  owner?: IUser | null;
  billingAddress?: IAddress | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public purchased?: number | null,
    public purchaseDate?: dayjs.Dayjs | null,
    public purchasePrice?: number | null,
    public orderLines?: IOrderLine[] | null,
    public owner?: IUser | null,
    public billingAddress?: IAddress | null
  ) {
    this.purchased = this.purchased ?? 0;
  }
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
