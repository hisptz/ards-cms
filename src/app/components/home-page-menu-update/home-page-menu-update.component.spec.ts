import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageMenuUpdateComponent } from './home-page-menu-update.component';

describe('HomePageMenuUpdateComponent', () => {
  let component: HomePageMenuUpdateComponent;
  let fixture: ComponentFixture<HomePageMenuUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageMenuUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageMenuUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
