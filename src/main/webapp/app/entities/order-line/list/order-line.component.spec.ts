import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OrderLineService } from '../service/order-line.service';

import { OrderLineComponent } from './order-line.component';

describe('Component Tests', () => {
  describe('OrderLine Management Component', () => {
    let comp: OrderLineComponent;
    let fixture: ComponentFixture<OrderLineComponent>;
    let service: OrderLineService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderLineComponent],
      })
        .overrideTemplate(OrderLineComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderLineComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(OrderLineService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.orderLines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
