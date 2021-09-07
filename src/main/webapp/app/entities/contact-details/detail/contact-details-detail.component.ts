import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContactDetails } from '../contact-details.model';

@Component({
  selector: 'jhi-contact-details-detail',
  templateUrl: './contact-details-detail.component.html',
})
export class ContactDetailsDetailComponent implements OnInit {
  contactDetails: IContactDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contactDetails }) => {
      this.contactDetails = contactDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
