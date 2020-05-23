import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn004Component } from './sn004.component';

describe('Sn004Component', () => {
  let component: Sn004Component;
  let fixture: ComponentFixture<Sn004Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn004Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
