import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn003Component } from './sn003.component';

describe('Sn003Component', () => {
  let component: Sn003Component;
  let fixture: ComponentFixture<Sn003Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn003Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
