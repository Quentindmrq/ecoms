import { Route } from '@angular/router';

import { PanierComponent } from './panier.component';

export const PANIER_ROUTE: Route = {
  path: '',
  component: PanierComponent,
  outlet: 'cart',
};
