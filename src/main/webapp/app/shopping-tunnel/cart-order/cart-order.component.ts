import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Address } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.scss'],
})
export class CartOrderComponent implements OnInit {
  formGroupStep1: FormGroup;

  model: Address;

  constructor(private _formBuilder: FormBuilder) {
    //donothing
  }

  ngOnInit(): void {
    this.formGroupStep1 = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.model = new Address();
    //Todo - controle
  }

  onSubmit(): void {
    //TODO -- envoyer a l api
    window.console.debug(this.model);
  }
}
