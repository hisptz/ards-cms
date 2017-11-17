import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRendererComponent } from './article-renderer.component';

describe('ArticleRendererComponent', () => {
  let component: ArticleRendererComponent;
  let fixture: ComponentFixture<ArticleRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
