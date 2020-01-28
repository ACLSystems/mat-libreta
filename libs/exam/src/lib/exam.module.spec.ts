import { async, TestBed } from '@angular/core/testing';
import { ExamModule } from './exam.module';

describe('ExamModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExamModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ExamModule).toBeDefined();
  });
});
