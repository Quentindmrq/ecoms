import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IContactDetails, ContactDetails } from '../contact-details.model';
import { ContactDetailsService } from '../service/contact-details.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

@Component({
  selector: 'jhi-contact-details-update',
  templateUrl: './contact-details-update.component.html',
})
export class ContactDetailsUpdateComponent implements OnInit {
  isSaving = false;

  addressesCollection: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    phoneNumber: [],
    address: [],
  });

  constructor(
    protected contactDetailsService: ContactDetailsService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contactDetails }) => {
      this.updateForm(contactDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contactDetails = this.createFromForm();
    if (contactDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.contactDetailsService.update(contactDetails));
    } else {
      this.subscribeToSaveResponse(this.contactDetailsService.create(contactDetails));
    }
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContactDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contactDetails: IContactDetails): void {
    this.editForm.patchValue({
      id: contactDetails.id,
      phoneNumber: contactDetails.phoneNumber,
      address: contactDetails.address,
    });

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesCollection, contactDetails.address);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'contactdetails-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));
  }

  protected createFromForm(): IContactDetails {
    return {
      ...new ContactDetails(),
      id: this.editForm.get(['id'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }
}
