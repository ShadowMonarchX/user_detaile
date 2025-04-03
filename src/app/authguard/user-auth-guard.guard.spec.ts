import { TestBed } from '@angular/core/testing';

import { UserAuthGuardGuard } from './user-auth-guard.guard';

describe('UserAuthGuardGuard', () => {
  let guard: UserAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
