import { TestBed } from '@angular/core/testing';

import { EmployeeWebService } from './employee-web.service';

describe('EmployeeWebService', () => {
  let service: EmployeeWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
