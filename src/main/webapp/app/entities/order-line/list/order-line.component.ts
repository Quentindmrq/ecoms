import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderLine } from '../order-line.model';
import { OrderLineService } from '../service/order-line.service';
import { OrderLineDeleteDialogComponent } from '../delete/order-line-delete-dialog.component';

@Component({
  selector: 'jhi-order-line',
  templateUrl: './order-line.component.html',
})
export class OrderLineComponent implements OnInit {
  orderLines?: IOrderLine[];
  isLoading = false;

  constructor(protected orderLineService: OrderLineService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.orderLineService.query().subscribe(
      (res: HttpResponse<IOrderLine[]>) => {
        this.isLoading = false;
        this.orderLines = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOrderLine): number {
    return item.id!;
  }

  delete(orderLine: IOrderLine): void {
    const modalRef = this.modalService.open(OrderLineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderLine = orderLine;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
