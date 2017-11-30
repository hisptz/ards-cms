import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMessageDisplayComponent } from './right-message-display.component';

describe('RightMessageDisplayComponent', () => {
  let component: RightMessageDisplayComponent;
  let fixture: ComponentFixture<RightMessageDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightMessageDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMessageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
