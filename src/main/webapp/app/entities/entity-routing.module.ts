import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'servicesenligneApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'stock',
        data: { pageTitle: 'servicesenligneApp.stock.home.title' },
        loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
      },
      {
        path: 'contact-details',
        data: { pageTitle: 'servicesenligneApp.contactDetails.home.title' },
        loadChildren: () => import('./contact-details/contact-details.module').then(m => m.ContactDetailsModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'servicesenligneApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'servicesenligneApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'order-line',
        data: { pageTitle: 'servicesenligneApp.orderLine.home.title' },
        loadChildren: () => import('./order-line/order-line.module').then(m => m.OrderLineModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
