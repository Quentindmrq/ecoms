import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'app/cart/cart.service';
import { Address } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-shopping-tunnel',
  templateUrl: './shopping-tunnel.component.html',
  styleUrls: ['./shopping-tunnel.component.scss'],
})
export class ShoppingTunnelComponent implements OnInit {
  form1: FormGroup;
  form2: FormGroup;

  model: Address;

  months: number[];
  years: number[];

  constructor(private cartService: CartService, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const now = new Date();
    this.months = new Array<number>();
    this.years = new Array<number>();
    for (let i = 0; i < 12; i++) {
      this.months.push(i + 1);
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

    this.model = new Address();
  }
}
