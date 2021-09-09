import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartOrderComponent } from './cart-order.component';

const routes: Routes = [{ path: '', component: CartOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartOrderRoutingModule {}
