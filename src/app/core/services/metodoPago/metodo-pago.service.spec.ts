import { TestBed } from '@angular/core/testing';

import { metodoPagoService } from './metodo-pago.service';

describe('MetodoPagoService', () => {
  let service: metodoPagoService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(metodoPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
