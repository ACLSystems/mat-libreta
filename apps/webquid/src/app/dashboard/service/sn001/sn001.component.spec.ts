import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SN001Component } from './sn001.component';

describe('SN001Component', () => {
  let component: SN001Component;
  let fixture: ComponentFixture<SN001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SN001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SN001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
