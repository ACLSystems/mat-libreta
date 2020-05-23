import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn002Component } from './sn002.component';

describe('Sn002Component', () => {
  let component: Sn002Component;
  let fixture: ComponentFixture<Sn002Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn002Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
