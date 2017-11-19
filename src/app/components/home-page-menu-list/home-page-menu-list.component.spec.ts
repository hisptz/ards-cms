import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageMenuListComponent } from './home-page-menu-list.component';

describe('HomePageMenuListComponent', () => {
  let component: HomePageMenuListComponent;
  let fixture: ComponentFixture<HomePageMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
