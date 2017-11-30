import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSharingUpdateComponent } from './info-sharing-update.component';

describe('InfoSharingUpdateComponent', () => {
  let component: InfoSharingUpdateComponent;
  let fixture: ComponentFixture<InfoSharingUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSharingUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSharingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
