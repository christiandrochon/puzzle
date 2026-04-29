import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageJeu } from './page-jeu';

describe('PageJeu', () => {
  let component: PageJeu;
  let fixture: ComponentFixture<PageJeu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageJeu],
    }).compileComponents();

    fixture = TestBed.createComponent(PageJeu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
