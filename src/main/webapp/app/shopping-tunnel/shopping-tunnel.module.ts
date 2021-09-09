import { NgModule } from '@angular/core';

import { CartModule } from 'app/cart/cart.module';
import { SharedModule } from 'app/shared/shared.module';
import { TunnelStepperComponent } from './tunnel-stepper/tunnel-stepper.component';
import { BankDataComponent } from './bank-data/bank-data.component';
import { CartOrderComponent } from './cart-order/cart-order.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SHOPPING_TUNNEL_ROUTE } from './shopping-tunnel.route';

@NgModule({
  declarations: [TunnelStepperComponent, BankDataComponent, CartOrderComponent],
  imports: [CartModule, FormsModule, SharedModule, RouterModule.forChild([SHOPPING_TUNNEL_ROUTE])],
})
export class ShoppingTunnelModule {}
