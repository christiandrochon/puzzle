import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateauChenille } from './plateau-chenille';

describe('PlateauChenille', () => {
  let component: PlateauChenille;
  let fixture: ComponentFixture<PlateauChenille>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlateauChenille],
    }).compileComponents();

    fixture = TestBed.createComponent(PlateauChenille);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
