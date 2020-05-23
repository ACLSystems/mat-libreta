import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn007Component } from './sn007.component';

describe('Sn007Component', () => {
  let component: Sn007Component;
  let fixture: ComponentFixture<Sn007Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn007Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn007Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
