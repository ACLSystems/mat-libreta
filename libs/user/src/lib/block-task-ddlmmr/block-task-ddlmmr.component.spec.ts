import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTaskDdlmmrComponent } from './block-task-ddlmmr.component';

describe('BlockTaskDdlmmrComponent', () => {
  let component: BlockTaskDdlmmrComponent;
  let fixture: ComponentFixture<BlockTaskDdlmmrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTaskDdlmmrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTaskDdlmmrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
