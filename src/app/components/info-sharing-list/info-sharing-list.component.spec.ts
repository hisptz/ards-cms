import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSharingListComponent } from './info-sharing-list.component';

describe('InfoSharingListComponent', () => {
  let component: InfoSharingListComponent;
  let fixture: ComponentFixture<InfoSharingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSharingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSharingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
