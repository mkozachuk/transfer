import { TestBed } from '@angular/core/testing';

import { KeyingServiceService } from './keying-service.service';

describe('KeyingServiceService', () => {
  let service: KeyingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
