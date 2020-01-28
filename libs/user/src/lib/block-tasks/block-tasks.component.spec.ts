import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTasksComponent } from './block-tasks.component';

describe('BlockTasksComponent', () => {
  let component: BlockTasksComponent;
  let fixture: ComponentFixture<BlockTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
