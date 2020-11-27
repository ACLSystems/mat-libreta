import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshcallerComponent } from './freshcaller.component';

describe('FreshcallerComponent', () => {
  let component: FreshcallerComponent;
  let fixture: ComponentFixture<FreshcallerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshcallerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshcallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
