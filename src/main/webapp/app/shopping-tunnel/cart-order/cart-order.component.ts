import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Address } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.scss'],
})
export class CartOrderComponent implements OnInit {
  formGroup: FormGroup;

  model: Address;

  constructor(private ctrlContainer: FormGroupDirective, private fb: FormBuilder) {
    //donothing
  }

  ngOnInit(): void {
    this.model = new Address();
    this.formGroup = this.ctrlContainer.form;

    //Todo - controle
  }

  onSubmit(): void {
    //TODO -- envoyer a l api
    window.console.debug(this.model);
  }
}
