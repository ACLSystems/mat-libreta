import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshdeskComponent } from './freshdesk.component';

describe('FreshdeskComponent', () => {
  let component: FreshdeskComponent;
  let fixture: ComponentFixture<FreshdeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshdeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
