jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IContactDetails, ContactDetails } from '../contact-details.model';
import { ContactDetailsService } from '../service/contact-details.service';

import { ContactDetailsRoutingResolveService } from './contact-details-routing-resolve.service';

describe('Service Tests', () => {
  describe('ContactDetails routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ContactDetailsRoutingResolveService;
    let service: ContactDetailsService;
    let resultContactDetails: IContactDetails | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ContactDetailsRoutingResolveService);
      service = TestBed.inject(ContactDetailsService);
      resultContactDetails = undefined;
    });

    describe('resolve', () => {
      it('should return IContactDetails returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContactDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultContactDetails).toEqual({ id: 123 });
      });

      it('should return new IContactDetails if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContactDetails = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultContactDetails).toEqual(new ContactDetails());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ContactDetails })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContactDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultContactDetails).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
