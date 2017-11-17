import { TestBed, inject } from '@angular/core/testing';

import { ExcelDownloadService } from './excel-download.service';

describe('ExcelDownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcelDownloadService]
    });
  });

  it('should ...', inject([ExcelDownloadService], (service: ExcelDownloadService) => {
    expect(service).toBeTruthy();
  }));
});
