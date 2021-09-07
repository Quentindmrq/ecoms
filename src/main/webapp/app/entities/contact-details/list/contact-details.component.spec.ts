import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContactDetailsService } from '../service/contact-details.service';

import { ContactDetailsComponent } from './contact-details.component';

describe('Component Tests', () => {
  describe('ContactDetails Management Component', () => {
    let comp: ContactDetailsComponent;
    let fixture: ComponentFixture<ContactDetailsComponent>;
    let service: ContactDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactDetailsComponent],
      })
        .overrideTemplate(ContactDetailsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContactDetailsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ContactDetailsService);

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
      expect(comp.contactDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
