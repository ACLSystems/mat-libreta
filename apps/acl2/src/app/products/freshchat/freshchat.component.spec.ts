import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshchatComponent } from './freshchat.component';

describe('FreshchatComponent', () => {
  let component: FreshchatComponent;
  let fixture: ComponentFixture<FreshchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
