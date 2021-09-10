import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingTunnelRoutingModule } from './shopping-tunnel-routing.module';
import { ShoppingTunnelComponent } from './shopping-tunnel.component';
import { TunnelStepperComponent } from './tunnel-stepper/tunnel-stepper.component';
import { CartOrderComponent } from './cart-order/cart-order.component';
import { BankDataComponent } from './bank-data/bank-data.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShoppingTunnelComponent, TunnelStepperComponent, CartOrderComponent, BankDataComponent],
  imports: [CommonModule, ShoppingTunnelRoutingModule, SharedModule, FormsModule],
})
export class ShoppingTunnelModule {}
