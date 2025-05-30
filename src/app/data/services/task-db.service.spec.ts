import { TestBed } from '@angular/core/testing';

import { TaskDbService } from './task-db.service';

describe('TaskDbService', () => {
  let service: TaskDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
