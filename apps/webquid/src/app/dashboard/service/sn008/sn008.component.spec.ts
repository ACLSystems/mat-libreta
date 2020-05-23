import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn008Component } from './sn008.component';

describe('Sn008Component', () => {
  let component: Sn008Component;
  let fixture: ComponentFixture<Sn008Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn008Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn008Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
