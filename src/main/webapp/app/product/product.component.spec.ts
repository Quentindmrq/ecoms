import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from 'app/app-routing.module';
import { ErrorComponent } from 'app/layouts/error/error.component';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
import { HasAnyAuthorityDirective } from 'app/shared/auth/has-any-authority.directive';
import { JhMaterialModule } from 'app/shared/jhmaterial.module';
import { FindLanguageFromKeyPipe } from 'app/shared/language/find-language-from-key.pipe';

import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent, NavbarComponent, ErrorComponent, HasAnyAuthorityDirective, FindLanguageFromKeyPipe],
      imports: [JhMaterialModule, AppRoutingModule, FontAwesomeModule, FlexLayoutModule, HttpClientModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
