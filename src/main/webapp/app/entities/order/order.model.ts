import * as dayjs from 'dayjs';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { IContactDetails } from 'app/entities/contact-details/contact-details.model';

export interface IOrder {
  id?: number;
  purchaseDate?: dayjs.Dayjs | null;
  orderLines?: IOrderLine[] | null;
  contactDetails?: IContactDetails | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public purchaseDate?: dayjs.Dayjs | null,
    public orderLines?: IOrderLine[] | null,
    public contactDetails?: IContactDetails | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
