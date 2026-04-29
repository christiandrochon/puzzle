import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauResultat } from './panneau-resultat';

describe('PanneauResultat', () => {
  let component: PanneauResultat;
  let fixture: ComponentFixture<PanneauResultat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanneauResultat],
    }).compileComponents();

    fixture = TestBed.createComponent(PanneauResultat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
