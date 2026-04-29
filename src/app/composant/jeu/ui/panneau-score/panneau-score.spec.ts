import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauScore } from './panneau-score';

describe('PanneauScore', () => {
  let component: PanneauScore;
  let fixture: ComponentFixture<PanneauScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanneauScore],
    }).compileComponents();

    fixture = TestBed.createComponent(PanneauScore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
