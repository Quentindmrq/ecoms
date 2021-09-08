jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderService } from '../service/order.service';
import { IOrder, Order } from '../order.model';
import { IContactDetails } from 'app/entities/contact-details/contact-details.model';
import { ContactDetailsService } from 'app/entities/contact-details/service/contact-details.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Component Tests', () => {
  describe('Order Management Update Component', () => {
    let comp: OrderUpdateComponent;
    let fixture: ComponentFixture<OrderUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderService: OrderService;
    let contactDetailsService: ContactDetailsService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderService = TestBed.inject(OrderService);
      contactDetailsService = TestBed.inject(ContactDetailsService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ContactDetails query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const contactDetails: IContactDetails = { id: 58291 };
        order.contactDetails = contactDetails;

        const contactDetailsCollection: IContactDetails[] = [{ id: 78361 }];
        jest.spyOn(contactDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: contactDetailsCollection })));
        const additionalContactDetails = [contactDetails];
        const expectedCollection: IContactDetails[] = [...additionalContactDetails, ...contactDetailsCollection];
        jest.spyOn(contactDetailsService, 'addContactDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(contactDetailsService.query).toHaveBeenCalled();
        expect(contactDetailsService.addContactDetailsToCollectionIfMissing).toHaveBeenCalledWith(
          contactDetailsCollection,
          ...additionalContactDetails
        );
        expect(comp.contactDetailsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const owner: IUser = { id: 95442 };
        order.owner = owner;

        const userCollection: IUser[] = [{ id: 55391 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [owner];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const order: IOrder = { id: 456 };
        const contactDetails: IContactDetails = { id: 68701 };
        order.contactDetails = contactDetails;
        const owner: IUser = { id: 60405 };
        order.owner = owner;

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(order));
        expect(comp.contactDetailsSharedCollection).toContain(contactDetails);
        expect(comp.usersSharedCollection).toContain(owner);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Order>>();
        const order = { id: 123 };
        jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: order }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderService.update).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Order>>();
        const order = new Order();
        jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: order }));
        saveSubject.complete();

        // THEN
        expect(orderService.create).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Order>>();
        const order = { id: 123 };
        jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderService.update).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackContactDetailsById', () => {
        it('Should return tracked ContactDetails primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackContactDetailsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
