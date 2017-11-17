import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationunitSelectorComponent } from './organisationunit-selector.component';

describe('OrganisationunitSelectorComponent', () => {
  let component: OrganisationunitSelectorComponent;
  let fixture: ComponentFixture<OrganisationunitSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationunitSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationunitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
