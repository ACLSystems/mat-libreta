import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshserviceComponent } from './freshservice.component';

describe('FreshserviceComponent', () => {
  let component: FreshserviceComponent;
  let fixture: ComponentFixture<FreshserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
