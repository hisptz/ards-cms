import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationunitLevelSelectorComponent } from './organisationunit-level-selector.component';

describe('OrganisationunitLevelSelectorComponent', () => {
  let component: OrganisationunitLevelSelectorComponent;
  let fixture: ComponentFixture<OrganisationunitLevelSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationunitLevelSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationunitLevelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
