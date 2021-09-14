import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JhMaterialModule } from 'app/shared/jhmaterial.module';

import { ShoppingTunnelComponent } from './shopping-tunnel.component';

describe('ShoppingTunnelComponent', () => {
  let component: ShoppingTunnelComponent;
  let fixture: ComponentFixture<ShoppingTunnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingTunnelComponent],
      imports: [JhMaterialModule, BrowserAnimationsModule, ReactiveFormsModule, HttpClientModule, FormsModule, FlexLayoutModule],
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
