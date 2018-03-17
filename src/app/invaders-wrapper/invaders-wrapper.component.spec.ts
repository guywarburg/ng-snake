import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvadersWrapperComponent } from './invaders-wrapper.component';

describe('InvadersWrapperComponent', () => {
  let component: InvadersWrapperComponent;
  let fixture: ComponentFixture<InvadersWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvadersWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvadersWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
