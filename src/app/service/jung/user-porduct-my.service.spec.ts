import { TestBed } from '@angular/core/testing';

import { UserPorductMyService } from './user-porduct-my.service';

describe('UserPorductMyService', () => {
  let service: UserPorductMyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPorductMyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
