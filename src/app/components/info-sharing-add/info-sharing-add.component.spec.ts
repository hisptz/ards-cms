import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSharingAddComponent } from './info-sharing-add.component';

describe('InfoSharingAddComponent', () => {
  let component: InfoSharingAddComponent;
  let fixture: ComponentFixture<InfoSharingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSharingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSharingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
