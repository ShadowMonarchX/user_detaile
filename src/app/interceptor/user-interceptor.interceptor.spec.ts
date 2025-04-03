import { TestBed } from '@angular/core/testing';

import { UserInterceptorInterceptor } from './user-interceptor.interceptor';

describe('UserInterceptorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [UserInterceptorInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: UserInterceptorInterceptor = TestBed.inject(
      UserInterceptorInterceptor,
    );
    expect(interceptor).toBeTruthy();
  });
});
