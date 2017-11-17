import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSharingComponent } from './info-sharing.component';

describe('InfoSharingComponent', () => {
  let component: InfoSharingComponent;
  let fixture: ComponentFixture<InfoSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
