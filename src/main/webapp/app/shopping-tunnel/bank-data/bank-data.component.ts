import { Component, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Address } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-bank-data',
  templateUrl: './bank-data.component.html',
  styleUrls: ['./bank-data.component.scss'],
})
export class BankDataComponent {
  formGroup: FormGroup;

  constructor(private ctrlContainer: FormGroupDirective, private fb: FormBuilder) {
    //donothing
  }

  ngOnInit(): void {
    this.formGroup = this.ctrlContainer.form;

    //Todo - controle
  }
}
