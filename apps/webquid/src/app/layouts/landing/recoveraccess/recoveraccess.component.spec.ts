import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveraccessComponent } from './recoveraccess.component';

describe('RecoveraccessComponent', () => {
  let component: RecoveraccessComponent;
  let fixture: ComponentFixture<RecoveraccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveraccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveraccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
