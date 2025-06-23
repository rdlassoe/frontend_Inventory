import { ComponentFixture, TestBed } from '@angular/core/testing';

import { salescomparisonComponent } from './sales-camparison.component';

describe('SalesCamparisonComponent', () => {
  let component: salescomparisonComponent;
  let fixture: ComponentFixture<salescomparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [salescomparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(salescomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
