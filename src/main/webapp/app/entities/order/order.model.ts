import * as dayjs from 'dayjs';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { IContactDetails } from 'app/entities/contact-details/contact-details.model';
import { IUser } from 'app/entities/user/user.model';

export interface IOrder {
  id?: number;
  purchaseDate?: dayjs.Dayjs | null;
  orderLines?: IOrderLine[] | null;
  contactDetails?: IContactDetails | null;
  owner?: IUser | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public purchaseDate?: dayjs.Dayjs | null,
    public orderLines?: IOrderLine[] | null,
    public contactDetails?: IContactDetails | null,
    public owner?: IUser | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
