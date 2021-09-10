import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingTunnelComponent } from './shopping-tunnel.component';

describe('ShoppingTunnelComponent', () => {
  let component: ShoppingTunnelComponent;
  let fixture: ComponentFixture<ShoppingTunnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingTunnelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingTunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
