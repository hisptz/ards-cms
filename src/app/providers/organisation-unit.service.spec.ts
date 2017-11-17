import { TestBed, inject } from '@angular/core/testing';

import { OrganisationUnitService } from './organisation-unit.service';

describe('OrganisationUnitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationUnitService]
    });
  });

  it('should ...', inject([OrganisationUnitService], (service: OrganisationUnitService) => {
    expect(service).toBeTruthy();
  }));
});
