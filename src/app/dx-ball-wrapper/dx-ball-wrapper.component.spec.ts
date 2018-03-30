import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DxBallWrapperComponent } from './dx-ball-wrapper.component';

describe('DxBallWrapperComponent', () => {
  let component: DxBallWrapperComponent;
  let fixture: ComponentFixture<DxBallWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DxBallWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DxBallWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
