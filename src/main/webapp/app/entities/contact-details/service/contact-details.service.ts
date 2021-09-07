import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContactDetails, getContactDetailsIdentifier } from '../contact-details.model';

export type EntityResponseType = HttpResponse<IContactDetails>;
export type EntityArrayResponseType = HttpResponse<IContactDetails[]>;

@Injectable({ providedIn: 'root' })
export class ContactDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contact-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contactDetails: IContactDetails): Observable<EntityResponseType> {
    return this.http.post<IContactDetails>(this.resourceUrl, contactDetails, { observe: 'response' });
  }

  update(contactDetails: IContactDetails): Observable<EntityResponseType> {
    return this.http.put<IContactDetails>(`${this.resourceUrl}/${getContactDetailsIdentifier(contactDetails) as number}`, contactDetails, {
      observe: 'response',
    });
  }

  partialUpdate(contactDetails: IContactDetails): Observable<EntityResponseType> {
    return this.http.patch<IContactDetails>(
      `${this.resourceUrl}/${getContactDetailsIdentifier(contactDetails) as number}`,
      contactDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContactDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContactDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContactDetailsToCollectionIfMissing(
    contactDetailsCollection: IContactDetails[],
    ...contactDetailsToCheck: (IContactDetails | null | undefined)[]
  ): IContactDetails[] {
    const contactDetails: IContactDetails[] = contactDetailsToCheck.filter(isPresent);
    if (contactDetails.length > 0) {
      const contactDetailsCollectionIdentifiers = contactDetailsCollection.map(
        contactDetailsItem => getContactDetailsIdentifier(contactDetailsItem)!
      );
      const contactDetailsToAdd = contactDetails.filter(contactDetailsItem => {
        const contactDetailsIdentifier = getContactDetailsIdentifier(contactDetailsItem);
        if (contactDetailsIdentifier == null || contactDetailsCollectionIdentifiers.includes(contactDetailsIdentifier)) {
          return false;
        }
        contactDetailsCollectionIdentifiers.push(contactDetailsIdentifier);
        return true;
      });
      return [...contactDetailsToAdd, ...contactDetailsCollection];
    }
    return contactDetailsCollection;
  }
}
