import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunnelStepperComponent } from './tunnel-stepper.component';

describe('TunnelStepperComponent', () => {
  let component: TunnelStepperComponent;
  let fixture: ComponentFixture<TunnelStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TunnelStepperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TunnelStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
