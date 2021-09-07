import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ContactDetailsDetailComponent } from './contact-details-detail.component';

describe('Component Tests', () => {
  describe('ContactDetails Management Detail Component', () => {
    let comp: ContactDetailsDetailComponent;
    let fixture: ComponentFixture<ContactDetailsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ContactDetailsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ contactDetails: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ContactDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ContactDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load contactDetails on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.contactDetails).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
