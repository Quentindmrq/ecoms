import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { IContactDetails } from 'app/entities/contact-details/contact-details.model';
import { ContactDetailsService } from 'app/entities/contact-details/service/contact-details.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  contactDetailsSharedCollection: IContactDetails[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    purchaseDate: [],
    contactDetails: [],
    owner: [],
  });

  constructor(
    protected orderService: OrderService,
    protected contactDetailsService: ContactDetailsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      if (order.id === undefined) {
        const today = dayjs().startOf('day');
        order.purchaseDate = today;
      }

      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackContactDetailsById(index: number, item: IContactDetails): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      purchaseDate: order.purchaseDate ? order.purchaseDate.format(DATE_TIME_FORMAT) : null,
      contactDetails: order.contactDetails,
      owner: order.owner,
    });

    this.contactDetailsSharedCollection = this.contactDetailsService.addContactDetailsToCollectionIfMissing(
      this.contactDetailsSharedCollection,
      order.contactDetails
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, order.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.contactDetailsService
      .query()
      .pipe(map((res: HttpResponse<IContactDetails[]>) => res.body ?? []))
      .pipe(
        map((contactDetails: IContactDetails[]) =>
          this.contactDetailsService.addContactDetailsToCollectionIfMissing(contactDetails, this.editForm.get('contactDetails')!.value)
        )
      )
      .subscribe((contactDetails: IContactDetails[]) => (this.contactDetailsSharedCollection = contactDetails));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('owner')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      purchaseDate: this.editForm.get(['purchaseDate'])!.value
        ? dayjs(this.editForm.get(['purchaseDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      contactDetails: this.editForm.get(['contactDetails'])!.value,
      owner: this.editForm.get(['owner'])!.value,
    };
  }
}
