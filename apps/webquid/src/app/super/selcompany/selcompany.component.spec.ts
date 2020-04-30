import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelcompanyComponent } from './selcompany.component';

describe('SelcompanyComponent', () => {
  let component: SelcompanyComponent;
  let fixture: ComponentFixture<SelcompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelcompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
