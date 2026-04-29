import { TestBed } from '@angular/core/testing';

import { SessionJeu } from './session-jeu';

describe('SessionJeu', () => {
  let service: SessionJeu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionJeu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
