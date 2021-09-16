import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { JhMaterialModule } from '../jhmaterial.module';
import { TranslateDirective } from '../language/translate.directive';

import { SelectProductCategoriesComponent } from './select-product-categories.component';

describe('SelectProductCategoriesComponent', () => {
  let component: SelectProductCategoriesComponent;
  let fixture: ComponentFixture<SelectProductCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectProductCategoriesComponent, TranslateDirective],
      imports: [RouterTestingModule, JhMaterialModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProductCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
