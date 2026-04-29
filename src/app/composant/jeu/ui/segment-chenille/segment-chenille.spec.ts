import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentChenille } from './segment-chenille';

describe('SegmentChenille', () => {
  let component: SegmentChenille;
  let fixture: ComponentFixture<SegmentChenille>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentChenille],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentChenille);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
