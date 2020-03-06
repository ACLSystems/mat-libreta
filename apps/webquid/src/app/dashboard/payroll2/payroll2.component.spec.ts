import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Payroll2Component } from './payroll2.component';

describe('Payroll2Component', () => {
  let component: Payroll2Component;
  let fixture: ComponentFixture<Payroll2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Payroll2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Payroll2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
