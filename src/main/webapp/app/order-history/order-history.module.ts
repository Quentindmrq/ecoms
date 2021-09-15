import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { OrderHistoryComponent } from './order-history.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [OrderHistoryComponent],
  imports: [CommonModule, SharedModule, OrderHistoryRoutingModule],
})
export class OrderHistoryModule {}
