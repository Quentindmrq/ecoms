import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'app/cart/cart.service';
import { Address } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { OrderLine } from 'app/entities/order-line/order-line.model';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-shopping-tunnel',
  templateUrl: './shopping-tunnel.component.html',
  styleUrls: ['./shopping-tunnel.component.scss'],
})
export class ShoppingTunnelComponent implements OnInit {
  form1: FormGroup;
  form2: FormGroup;

  address: Address;

  error: any;

  months: string[];
  years: number[];

  constructor(
    private cartService: CartService,
    private _formBuilder: FormBuilder,
    private addressService: AddressService,
    private orderService: OrderService,
    private orderLineService: OrderLineService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.months = new Array<string>();
    this.years = new Array<number>();
    for (let i = 0; i < 12; i++) {
      this.months.push(String(i + 1).padStart(2, '0'));
      this.years.push(now.getFullYear() + i);
    }

    this.form1 = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
    });

    this.form2 = this._formBuilder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cardExpirationMonth: ['', Validators.required],
      cardExpirationYear: ['', Validators.required],
      cardValidationCode: ['', Validators.required],
    });
  }

  // public createOrder(): void {
  //   const firstName = this.form1.get('firstName')?.value;
  //   const lastName = this.form1.get('lastName')?.value;
  //   const address1 = this.form1.get('address1')?.value;
  //   const address2 = this.form1.get('address2')?.value;
  //   const country = this.form1.get('country')?.value;
  //   const postalCode = this.form1.get('postalCode')?.value;
  //   const city = this.form1.get('city')?.value;
  //   this.address = new Address(undefined, firstName, lastName, country, postalCode, city, address1, address2);

  //   // const cardName = this.form2.get('cardName')?.value;
  //   // const cardNumber = this.form2.get('cardNumber')?.value;
  //   // const cardExpirationMonth = this.form2.get('cardExpirationMonth')?.value;
  //   // const cardExpirationYear = this.form2.get('cardExpirationYear')?.value;
  //   // const cardValidationCode = this.form2.get('cardValidationCode')?.value;

  //   let addressId: number | undefined;
  //   this.addressService.create(this.address).subscribe(
  //     addressRes => (addressId = addressRes.body?.id),
  //     error => {
  //       this.error = error;
  //     }
  //   );

  //   let orderLineIds = Array<number>();
  //   this.cartService.cart.subscribe(cart => {
  //     cart.forEach(item => {
  //       const orderLine = new OrderLine(undefined, item.quantity, item.product);
  //       this.orderLineService.create(orderLine).subscribe(orderLineRes => {
  //         orderLineIds.push;
  //       });
  //     });
  //   });
  // }
}
