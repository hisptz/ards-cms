import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArdsMenuComponent } from './ards-menu.component';

describe('ArdsMenuComponent', () => {
  let component: ArdsMenuComponent;
  let fixture: ComponentFixture<ArdsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArdsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArdsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
