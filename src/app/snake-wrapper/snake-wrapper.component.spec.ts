import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeWrapperComponent } from './snake-wrapper.component';

describe('SnakeWrapperComponent', () => {
  let component: SnakeWrapperComponent;
  let fixture: ComponentFixture<SnakeWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnakeWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnakeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
