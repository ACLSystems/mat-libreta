import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollReceiptsComponent } from './payroll-receipts.component';

describe('PayrollReceiptsComponent', () => {
  let component: PayrollReceiptsComponent;
  let fixture: ComponentFixture<PayrollReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
