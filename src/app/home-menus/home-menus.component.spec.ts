import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMenusComponent } from './home-menus.component';

describe('HomeMenusComponent', () => {
  let component: HomeMenusComponent;
  let fixture: ComponentFixture<HomeMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
