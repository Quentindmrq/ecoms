import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContactDetailsComponent } from '../list/contact-details.component';
import { ContactDetailsDetailComponent } from '../detail/contact-details-detail.component';
import { ContactDetailsUpdateComponent } from '../update/contact-details-update.component';
import { ContactDetailsRoutingResolveService } from './contact-details-routing-resolve.service';

const contactDetailsRoute: Routes = [
  {
    path: '',
    component: ContactDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContactDetailsDetailComponent,
    resolve: {
      contactDetails: ContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContactDetailsUpdateComponent,
    resolve: {
      contactDetails: ContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContactDetailsUpdateComponent,
    resolve: {
      contactDetails: ContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contactDetailsRoute)],
  exports: [RouterModule],
})
export class ContactDetailsRoutingModule {}
