import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductCategoriesComponent } from './select-product-categories.component';

describe('SelectProductCategoriesComponent', () => {
  let component: SelectProductCategoriesComponent;
  let fixture: ComponentFixture<SelectProductCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectProductCategoriesComponent ]
    })
    .compileComponents();
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
