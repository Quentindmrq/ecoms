import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JhMaterialModule } from '../jhmaterial.module';

import { SelectProductCategoriesComponent } from './select-product-categories.component';

describe('SelectProductCategoriesComponent', () => {
  let component: SelectProductCategoriesComponent;
  let fixture: ComponentFixture<SelectProductCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectProductCategoriesComponent],
      imports: [RouterTestingModule, JhMaterialModule],
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
