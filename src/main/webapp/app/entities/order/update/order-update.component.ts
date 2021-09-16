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
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  addressesSharedCollection: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    purchased: [],
    purchaseDate: [],
    owner: [],
    purchasePrice: [],
    billingAddress: [],
  });

  constructor(
    protected orderService: OrderService,
    protected userService: UserService,
    protected addressService: AddressService,
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

  trackAddressById(index: number, item: IAddress): number {
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
      purchased: order.purchased,
      purchaseDate: order.purchaseDate ? order.purchaseDate.format(DATE_TIME_FORMAT) : null,
      owner: order.owner,
      purchasePrice: order.purchasePrice,
      billingAddress: order.billingAddress,
    });

    this.addressesSharedCollection = this.addressService.addAddressToCollectionIfMissing(
      this.addressesSharedCollection,
      order.billingAddress
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, order.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query()
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) =>
          this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('billingAddress')!.value)
        )
      )
      .subscribe((addresses: IAddress[]) => (this.addressesSharedCollection = addresses));

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
      purchased: this.editForm.get(['purchased'])!.value,
      purchaseDate: this.editForm.get(['purchaseDate'])!.value
        ? dayjs(this.editForm.get(['purchaseDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      owner: this.editForm.get(['owner'])!.value,
      purchasePrice: this.editForm.get(['purchasePrice'])!.value,
      billingAddress: this.editForm.get(['billingAddress'])!.value,
    };
  }
}
