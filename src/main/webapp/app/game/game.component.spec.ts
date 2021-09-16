import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { JhMaterialModule } from 'app/shared/jhmaterial.module';
import { ProductListComponent } from 'app/shared/product-list/product-list.component';
import { SelectProductCategoriesComponent } from 'app/shared/select-product-categories/select-product-categories.component';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameComponent, SelectProductCategoriesComponent, ProductListComponent],
      imports: [JhMaterialModule, HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
