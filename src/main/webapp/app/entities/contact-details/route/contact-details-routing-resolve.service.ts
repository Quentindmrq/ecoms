import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IContactDetails, ContactDetails } from '../contact-details.model';
import { ContactDetailsService } from '../service/contact-details.service';

@Injectable({ providedIn: 'root' })
export class ContactDetailsRoutingResolveService implements Resolve<IContactDetails> {
  constructor(protected service: ContactDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IContactDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((contactDetails: HttpResponse<ContactDetails>) => {
          if (contactDetails.body) {
            return of(contactDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ContactDetails());
  }
}
