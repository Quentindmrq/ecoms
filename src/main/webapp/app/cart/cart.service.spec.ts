import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CartService } from './cart.service';
import { TranslateDirective } from 'app/shared/language/translate.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
// import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslateDirective],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgxWebstorageModule.forRoot()],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
