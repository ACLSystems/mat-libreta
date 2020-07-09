import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTaskDdlmrComponent } from './block-task-ddlmr.component';

describe('BlockTaskDdlmrComponent', () => {
  let component: BlockTaskDdlmrComponent;
  let fixture: ComponentFixture<BlockTaskDdlmrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTaskDdlmrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTaskDdlmrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
