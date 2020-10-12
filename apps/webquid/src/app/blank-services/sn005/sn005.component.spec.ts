import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn005Component } from './sn005.component';

describe('Sn005Component', () => {
  let component: Sn005Component;
  let fixture: ComponentFixture<Sn005Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn005Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
