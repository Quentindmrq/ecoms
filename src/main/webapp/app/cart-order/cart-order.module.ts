import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartOrderRoutingModule } from './cart-order-routing.module';
import { CartOrderComponent } from './cart-order.component';

@NgModule({
  declarations: [CartOrderComponent],
  imports: [CommonModule, CartOrderRoutingModule],
})
export class CartOrderModule {}
