jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderLineService } from '../service/order-line.service';
import { IOrderLine, OrderLine } from '../order-line.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { OrderLineUpdateComponent } from './order-line-update.component';

describe('Component Tests', () => {
  describe('OrderLine Management Update Component', () => {
    let comp: OrderLineUpdateComponent;
    let fixture: ComponentFixture<OrderLineUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderLineService: OrderLineService;
    let productService: ProductService;
    let orderService: OrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderLineUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderLineUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderLineUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderLineService = TestBed.inject(OrderLineService);
      productService = TestBed.inject(ProductService);
      orderService = TestBed.inject(OrderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call product query and add missing value', () => {
        const orderLine: IOrderLine = { id: 456 };
        const product: IProduct = { id: 63374 };
        orderLine.product = product;

        const productCollection: IProduct[] = [{ id: 30020 }];
        jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
        const expectedCollection: IProduct[] = [product, ...productCollection];
        jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ orderLine });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, product);
        expect(comp.productsCollection).toEqual(expectedCollection);
      });

      it('Should call Order query and add missing value', () => {
        const orderLine: IOrderLine = { id: 456 };
        const order: IOrder = { id: 54146 };
        orderLine.order = order;

        const orderCollection: IOrder[] = [{ id: 89430 }];
        jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
        const additionalOrders = [order];
        const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
        jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ orderLine });
        comp.ngOnInit();

        expect(orderService.query).toHaveBeenCalled();
        expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, ...additionalOrders);
        expect(comp.ordersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const orderLine: IOrderLine = { id: 456 };
        const product: IProduct = { id: 19186 };
        orderLine.product = product;
        const order: IOrder = { id: 73284 };
        orderLine.order = order;

        activatedRoute.data = of({ orderLine });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(orderLine));
        expect(comp.productsCollection).toContain(product);
        expect(comp.ordersSharedCollection).toContain(order);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<OrderLine>>();
        const orderLine = { id: 123 };
        jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderLine });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderLine }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderLineService.update).toHaveBeenCalledWith(orderLine);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<OrderLine>>();
        const orderLine = new OrderLine();
        jest.spyOn(orderLineService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderLine });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: orderLine }));
        saveSubject.complete();

        // THEN
        expect(orderLineService.create).toHaveBeenCalledWith(orderLine);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<OrderLine>>();
        const orderLine = { id: 123 };
        jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ orderLine });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderLineService.update).toHaveBeenCalledWith(orderLine);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProductById', () => {
        it('Should return tracked Product primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackOrderById', () => {
        it('Should return tracked Order primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
