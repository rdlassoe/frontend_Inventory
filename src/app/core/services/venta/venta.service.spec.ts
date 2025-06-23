import { TestBed } from '@angular/core/testing';

import { ventaService } from './venta.service';

describe('VentaService', () => {
  let service: ventaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ventaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
