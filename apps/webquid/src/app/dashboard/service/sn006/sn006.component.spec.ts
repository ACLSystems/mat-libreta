import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sn006Component } from './sn006.component';

describe('Sn006Component', () => {
  let component: Sn006Component;
  let fixture: ComponentFixture<Sn006Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sn006Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sn006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
