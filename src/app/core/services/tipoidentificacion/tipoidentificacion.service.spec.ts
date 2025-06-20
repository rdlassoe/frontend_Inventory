import { TestBed } from '@angular/core/testing';

import { TipoidentificacionService } from './tipoidentificacion.service';

describe('TipoidentificacionService', () => {
  let service: TipoidentificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoidentificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
