import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContactDetails } from '../contact-details.model';
import { ContactDetailsService } from '../service/contact-details.service';
import { ContactDetailsDeleteDialogComponent } from '../delete/contact-details-delete-dialog.component';

@Component({
  selector: 'jhi-contact-details',
  templateUrl: './contact-details.component.html',
})
export class ContactDetailsComponent implements OnInit {
  contactDetails?: IContactDetails[];
  isLoading = false;

  constructor(protected contactDetailsService: ContactDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contactDetailsService.query().subscribe(
      (res: HttpResponse<IContactDetails[]>) => {
        this.isLoading = false;
        this.contactDetails = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IContactDetails): number {
    return item.id!;
  }

  delete(contactDetails: IContactDetails): void {
    const modalRef = this.modalService.open(ContactDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contactDetails = contactDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
