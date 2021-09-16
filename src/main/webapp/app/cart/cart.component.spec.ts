import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from 'app/app-routing.module';
import { ErrorComponent } from 'app/layouts/error/error.component';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
import { HasAnyAuthorityDirective } from 'app/shared/auth/has-any-authority.directive';
import { JhMaterialModule } from 'app/shared/jhmaterial.module';
import { FindLanguageFromKeyPipe } from 'app/shared/language/find-language-from-key.pipe';
import { TranslateDirective } from 'app/shared/language/translate.directive';

import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent, NavbarComponent, ErrorComponent, HasAnyAuthorityDirective, FindLanguageFromKeyPipe, TranslateDirective],
      imports: [JhMaterialModule, AppRoutingModule, HttpClientModule, FlexLayoutModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
