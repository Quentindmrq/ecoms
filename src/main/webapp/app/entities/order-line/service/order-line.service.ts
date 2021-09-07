import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderLine, getOrderLineIdentifier } from '../order-line.model';

export type EntityResponseType = HttpResponse<IOrderLine>;
export type EntityArrayResponseType = HttpResponse<IOrderLine[]>;

@Injectable({ providedIn: 'root' })
export class OrderLineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-lines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(orderLine: IOrderLine): Observable<EntityResponseType> {
    return this.http.post<IOrderLine>(this.resourceUrl, orderLine, { observe: 'response' });
  }

  update(orderLine: IOrderLine): Observable<EntityResponseType> {
    return this.http.put<IOrderLine>(`${this.resourceUrl}/${getOrderLineIdentifier(orderLine) as number}`, orderLine, {
      observe: 'response',
    });
  }

  partialUpdate(orderLine: IOrderLine): Observable<EntityResponseType> {
    return this.http.patch<IOrderLine>(`${this.resourceUrl}/${getOrderLineIdentifier(orderLine) as number}`, orderLine, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrderLine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrderLine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrderLineToCollectionIfMissing(
    orderLineCollection: IOrderLine[],
    ...orderLinesToCheck: (IOrderLine | null | undefined)[]
  ): IOrderLine[] {
    const orderLines: IOrderLine[] = orderLinesToCheck.filter(isPresent);
    if (orderLines.length > 0) {
      const orderLineCollectionIdentifiers = orderLineCollection.map(orderLineItem => getOrderLineIdentifier(orderLineItem)!);
      const orderLinesToAdd = orderLines.filter(orderLineItem => {
        const orderLineIdentifier = getOrderLineIdentifier(orderLineItem);
        if (orderLineIdentifier == null || orderLineCollectionIdentifiers.includes(orderLineIdentifier)) {
          return false;
        }
        orderLineCollectionIdentifiers.push(orderLineIdentifier);
        return true;
      });
      return [...orderLinesToAdd, ...orderLineCollection];
    }
    return orderLineCollection;
  }
}
