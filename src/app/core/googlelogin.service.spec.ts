import { TestBed } from '@angular/core/testing';

import { GoogleloginService } from './Services/googlelogin.service';

describe('GoogleloginService', () => {
  let service: GoogleloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
