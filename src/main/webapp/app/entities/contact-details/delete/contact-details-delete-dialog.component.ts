import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IContactDetails } from '../contact-details.model';
import { ContactDetailsService } from '../service/contact-details.service';

@Component({
  templateUrl: './contact-details-delete-dialog.component.html',
})
export class ContactDetailsDeleteDialogComponent {
  contactDetails?: IContactDetails;

  constructor(protected contactDetailsService: ContactDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contactDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
