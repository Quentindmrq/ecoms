import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IContactDetails, ContactDetails } from '../contact-details.model';

import { ContactDetailsService } from './contact-details.service';

describe('Service Tests', () => {
  describe('ContactDetails Service', () => {
    let service: ContactDetailsService;
    let httpMock: HttpTestingController;
    let elemDefault: IContactDetails;
    let expectedResult: IContactDetails | IContactDetails[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ContactDetailsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        phoneNumber: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ContactDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ContactDetails()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ContactDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            phoneNumber: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ContactDetails', () => {
        const patchObject = Object.assign({}, new ContactDetails());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ContactDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            phoneNumber: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ContactDetails', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addContactDetailsToCollectionIfMissing', () => {
        it('should add a ContactDetails to an empty array', () => {
          const contactDetails: IContactDetails = { id: 123 };
          expectedResult = service.addContactDetailsToCollectionIfMissing([], contactDetails);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(contactDetails);
        });

        it('should not add a ContactDetails to an array that contains it', () => {
          const contactDetails: IContactDetails = { id: 123 };
          const contactDetailsCollection: IContactDetails[] = [
            {
              ...contactDetails,
            },
            { id: 456 },
          ];
          expectedResult = service.addContactDetailsToCollectionIfMissing(contactDetailsCollection, contactDetails);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ContactDetails to an array that doesn't contain it", () => {
          const contactDetails: IContactDetails = { id: 123 };
          const contactDetailsCollection: IContactDetails[] = [{ id: 456 }];
          expectedResult = service.addContactDetailsToCollectionIfMissing(contactDetailsCollection, contactDetails);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(contactDetails);
        });

        it('should add only unique ContactDetails to an array', () => {
          const contactDetailsArray: IContactDetails[] = [{ id: 123 }, { id: 456 }, { id: 57988 }];
          const contactDetailsCollection: IContactDetails[] = [{ id: 123 }];
          expectedResult = service.addContactDetailsToCollectionIfMissing(contactDetailsCollection, ...contactDetailsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const contactDetails: IContactDetails = { id: 123 };
          const contactDetails2: IContactDetails = { id: 456 };
          expectedResult = service.addContactDetailsToCollectionIfMissing([], contactDetails, contactDetails2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(contactDetails);
          expect(expectedResult).toContain(contactDetails2);
        });

        it('should accept null and undefined values', () => {
          const contactDetails: IContactDetails = { id: 123 };
          expectedResult = service.addContactDetailsToCollectionIfMissing([], null, contactDetails, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(contactDetails);
        });

        it('should return initial array if no ContactDetails is added', () => {
          const contactDetailsCollection: IContactDetails[] = [{ id: 123 }];
          expectedResult = service.addContactDetailsToCollectionIfMissing(contactDetailsCollection, undefined, null);
          expect(expectedResult).toEqual(contactDetailsCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
