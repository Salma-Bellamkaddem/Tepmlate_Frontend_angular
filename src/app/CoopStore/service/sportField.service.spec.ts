/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SportFieldService } from './sportField.service';

describe('Service: SportField', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SportFieldService]
    });
  });

  it('should ...', inject([SportFieldService], (service: SportFieldService) => {
    expect(service).toBeTruthy();
  }));
});
