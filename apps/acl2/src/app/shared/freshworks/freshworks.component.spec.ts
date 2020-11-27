import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshworksComponent } from './freshworks.component';

describe('FreshworksComponent', () => {
  let component: FreshworksComponent;
  let fixture: ComponentFixture<FreshworksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
