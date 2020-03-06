import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImssComponent } from './imss.component';

describe('ImssComponent', () => {
  let component: ImssComponent;
  let fixture: ComponentFixture<ImssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
