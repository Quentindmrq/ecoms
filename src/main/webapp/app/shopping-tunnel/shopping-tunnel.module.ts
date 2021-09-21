import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingTunnelComponent } from './shopping-tunnel.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ShoppingTunnelRoutingModule } from './shopping-tunnel-routing.module';

@NgModule({
  declarations: [ShoppingTunnelComponent],
  imports: [CommonModule, ShoppingTunnelRoutingModule, SharedModule, FormsModule],
})
export class ShoppingTunnelModule {}
