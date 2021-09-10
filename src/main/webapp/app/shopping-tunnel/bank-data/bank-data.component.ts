import { Component, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { Address } from 'app/entities/address/address.model';

@Component({
  selector: 'jhi-bank-data',
  templateUrl: './bank-data.component.html',
  styleUrls: ['./bank-data.component.scss'],
})
export class BankDataComponent {
  formGroupStep2: FormGroup;

  constructor(private fb: FormBuilder) {
    //donothing
  }

  ngOnInit(): void {
    this.formGroupStep2 = this.fb.group({
      firstCtrl: ['', Validators.required],
    });
    //Todo - controle
  }
}
