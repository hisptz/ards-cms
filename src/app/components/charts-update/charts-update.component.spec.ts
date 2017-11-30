import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsUpdateComponent } from './charts-update.component';

describe('ChartsUpdateComponent', () => {
  let component: ChartsUpdateComponent;
  let fixture: ComponentFixture<ChartsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
