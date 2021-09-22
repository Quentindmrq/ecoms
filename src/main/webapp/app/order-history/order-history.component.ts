import { Component, OnInit } from '@angular/core';
import { PageableResponse } from 'app/entities/common/pageablehttpresponse.model';
import { IOrder, Order } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[];
  pageInfo: PageableResponse<IOrder> | null;
  loadingPages = false;
  error: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadingPages = true;
    this.orderService.query().subscribe(
      resOrders => {
        this.pageInfo = resOrders.body;
        if (resOrders.body?.content) {
          this.orders = resOrders.body.content;
        }
        this.loadingPages = false;
      },
      () => (this.loadingPages = false)
    );
  }

  loadNewPage(): void {
    if (!this.isLastPage) {
      this.loadingPages = true;

      this.orderService.query(this.request).subscribe(
        stockRes => {
          this.pageInfo = stockRes.body;
          if (stockRes.body?.content) {
            this.orders.push(...stockRes.body.content);
          }
          this.loadingPages = false;
        },
        error => {
          this.error = error;
          this.loadingPages = false;
        }
      );
    }
  }

  get isLastPage(): boolean {
    return this.pageInfo?.last ?? false;
  }
  private get request(): Record<string, unknown> {
    const pageNumber = this.pageInfo?.number !== undefined ? this.pageInfo.number + 1 : 0;
    const newReq: Record<string, unknown> = { page: pageNumber };
    return newReq;
  }
}
