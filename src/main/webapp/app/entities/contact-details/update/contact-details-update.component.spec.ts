jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContactDetailsService } from '../service/contact-details.service';
import { IContactDetails, ContactDetails } from '../contact-details.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { ContactDetailsUpdateComponent } from './contact-details-update.component';

describe('Component Tests', () => {
  describe('ContactDetails Management Update Component', () => {
    let comp: ContactDetailsUpdateComponent;
    let fixture: ComponentFixture<ContactDetailsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let contactDetailsService: ContactDetailsService;
    let addressService: AddressService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactDetailsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ContactDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContactDetailsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      contactDetailsService = TestBed.inject(ContactDetailsService);
      addressService = TestBed.inject(AddressService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call address query and add missing value', () => {
        const contactDetails: IContactDetails = { id: 456 };
        const address: IAddress = { id: 28242 };
        contactDetails.address = address;

        const addressCollection: IAddress[] = [{ id: 2684 }];
        jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
        const expectedCollection: IAddress[] = [address, ...addressCollection];
        jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ contactDetails });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
        expect(comp.addressesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const contactDetails: IContactDetails = { id: 456 };
        const address: IAddress = { id: 18737 };
        contactDetails.address = address;

        activatedRoute.data = of({ contactDetails });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(contactDetails));
        expect(comp.addressesCollection).toContain(address);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ContactDetails>>();
        const contactDetails = { id: 123 };
        jest.spyOn(contactDetailsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ contactDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contactDetails }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(contactDetailsService.update).toHaveBeenCalledWith(contactDetails);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ContactDetails>>();
        const contactDetails = new ContactDetails();
        jest.spyOn(contactDetailsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ contactDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contactDetails }));
        saveSubject.complete();

        // THEN
        expect(contactDetailsService.create).toHaveBeenCalledWith(contactDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ContactDetails>>();
        const contactDetails = { id: 123 };
        jest.spyOn(contactDetailsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ contactDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(contactDetailsService.update).toHaveBeenCalledWith(contactDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAddressById', () => {
        it('Should return tracked Address primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAddressById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
