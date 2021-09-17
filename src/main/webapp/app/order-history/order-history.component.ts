import { Component, OnInit } from '@angular/core';
import { Order } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.query().subscribe(resOrders => {
      if (resOrders.body) {
        this.orders = resOrders.body;
      }
    });
  }
}
