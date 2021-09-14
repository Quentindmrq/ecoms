import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'app/cart/cart.service';
import { BankDataComponent } from '../bank-data/bank-data.component';
import { CartOrderComponent } from '../cart-order/cart-order.component';

@Component({
  selector: 'jhi-tunnel-stepper',
  templateUrl: './tunnel-stepper.component.html',
  styleUrls: ['./tunnel-stepper.component.scss'],
})
export class TunnelStepperComponent {
  // implements OnInit {
  form1: FormGroup;
  form2: FormGroup;

  @ViewChild('stepOne') stepOneComponent: CartOrderComponent;
  @ViewChild('stepTwo') stepTwoComponent: BankDataComponent;

  constructor(private cartService: CartService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.form1 = this.stepOneComponent.formGroupStep1;
    this.form2 = this.stepTwoComponent.formGroupStep2;
    this.cdr.detectChanges();
  }
}
