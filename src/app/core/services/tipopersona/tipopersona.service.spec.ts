import { TestBed } from '@angular/core/testing';

import { TipoPersonaService } from './tipopersona.service';

describe('TypeserviceService', () => {
  let service: TipoPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
