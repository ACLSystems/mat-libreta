import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersByCompanyComponent } from './users-by-company.component';

describe('UsersByCompanyComponent', () => {
  let component: UsersByCompanyComponent;
  let fixture: ComponentFixture<UsersByCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersByCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersByCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
