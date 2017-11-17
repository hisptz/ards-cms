import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksUpdateComponent } from './links-update.component';

describe('LinksUpdateComponent', () => {
  let component: LinksUpdateComponent;
  let fixture: ComponentFixture<LinksUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
