import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'app/cart/cart.service';

@Component({
  selector: 'jhi-tunnel-stepper',
  templateUrl: './tunnel-stepper.component.html',
  styleUrls: ['./tunnel-stepper.component.scss'],
})
export class TunnelStepperComponent {
  // implements OnInit {
  formGroupStep1: FormGroup;
  formGroupStep2: FormGroup;

  constructor(private _formBuilder: FormBuilder, private cartService: CartService) {}

  //ngOnInit(): void {
  // this.formGroupStep1 = this._formBuilder.group({
  //   firstCtrl: ['', Validators.required],
  // });

  // this.formGroupStep2 = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });
  //}
}
