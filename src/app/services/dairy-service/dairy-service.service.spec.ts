import { TestBed } from '@angular/core/testing';

import { DairyServiceService } from './dairy-service.service';

describe('DairyServiceService', () => {
  let service: DairyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DairyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
