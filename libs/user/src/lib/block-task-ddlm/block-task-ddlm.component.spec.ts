import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTaskDdlmComponent } from './block-task-ddlm.component';

describe('BlockTaskDdlmComponent', () => {
  let component: BlockTaskDdlmComponent;
  let fixture: ComponentFixture<BlockTaskDdlmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockTaskDdlmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTaskDdlmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
