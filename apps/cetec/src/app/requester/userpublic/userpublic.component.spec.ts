import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpublicComponent } from './userpublic.component';

describe('UserpublicComponent', () => {
  let component: UserpublicComponent;
  let fixture: ComponentFixture<UserpublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
