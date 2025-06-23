import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorizedInventoryComponent } from './valorized-inventory.component';

describe('ValorizedInventoryComponent', () => {
  let component: ValorizedInventoryComponent;
  let fixture: ComponentFixture<ValorizedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValorizedInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValorizedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
