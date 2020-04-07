import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SN001AdminComponent } from './sn001-admin.component';

describe('SN001AdminComponent', () => {
  let component: SN001AdminComponent;
  let fixture: ComponentFixture<SN001AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SN001AdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SN001AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
