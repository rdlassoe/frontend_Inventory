import { ComponentFixture, TestBed } from '@angular/core/testing';

import { resumenventasComponent } from './resumenventas.component';

describe('ResumenventasComponent', () => {
  let component: resumenventasComponent;
  let fixture: ComponentFixture<resumenventasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [resumenventasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(resumenventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
