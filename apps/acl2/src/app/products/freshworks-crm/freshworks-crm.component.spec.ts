import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshworksCRMComponent } from './freshworks-crm.component';

describe('FreshworksCRMComponent', () => {
  let component: FreshworksCRMComponent;
  let fixture: ComponentFixture<FreshworksCRMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshworksCRMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshworksCRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
