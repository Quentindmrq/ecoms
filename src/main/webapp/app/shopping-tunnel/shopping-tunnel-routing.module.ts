import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingTunnelComponent } from './shopping-tunnel.component';

const routes: Routes = [{ path: '', component: ShoppingTunnelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingTunnelRoutingModule {}
