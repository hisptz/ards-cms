import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageMenuAddComponent } from './home-page-menu-add.component';

describe('HomePageMenuAddComponent', () => {
  let component: HomePageMenuAddComponent;
  let fixture: ComponentFixture<HomePageMenuAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageMenuAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageMenuAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
