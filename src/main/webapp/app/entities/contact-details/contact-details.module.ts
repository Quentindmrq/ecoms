import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContactDetailsComponent } from './list/contact-details.component';
import { ContactDetailsDetailComponent } from './detail/contact-details-detail.component';
import { ContactDetailsUpdateComponent } from './update/contact-details-update.component';
import { ContactDetailsDeleteDialogComponent } from './delete/contact-details-delete-dialog.component';
import { ContactDetailsRoutingModule } from './route/contact-details-routing.module';

@NgModule({
  imports: [SharedModule, ContactDetailsRoutingModule],
  declarations: [
    ContactDetailsComponent,
    ContactDetailsDetailComponent,
    ContactDetailsUpdateComponent,
    ContactDetailsDeleteDialogComponent,
  ],
  entryComponents: [ContactDetailsDeleteDialogComponent],
})
export class ContactDetailsModule {}
