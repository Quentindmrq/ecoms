import { TestBed } from '@angular/core/testing';

import { SelectProductCategoriesService } from './select-product-categories.service';

describe('SelectProductCategoriesService', () => {
  let service: SelectProductCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectProductCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
