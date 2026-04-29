import { TestBed } from '@angular/core/testing';

import { ValidateurPuzzleService } from './validateur-puzzle';
import { Puzzle } from '../modeles/puzzle';

describe('ValidateurPuzzle', () => {
  let service: ValidateurPuzzleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateurPuzzleService);
  });

  it('devrait valider une addition correcte', () => {
    const puzzle: Puzzle = {
      id: 'p1',
      difficulte: 'facile',
      tokens: [
        { id: '1', type: 'nombre', valeur: 2, modifiable: false },
        { id: '2', type: 'operateur', valeur: '+', modifiable: false },
        { id: '3', type: 'nombre', valeur: 3, modifiable: false },
        { id: '4', type: 'egal', valeur: '=', modifiable: false },
        { id: '5', type: 'nombre', valeur: 5, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(true);
  });

  it('devrait refuser une addition fausse', () => {
    const puzzle: Puzzle = {
      id: 'p1',
      difficulte: 'facile',
      tokens: [
        { id: '1', type: 'nombre', valeur: 2, modifiable: false },
        { id: '2', type: 'operateur', valeur: '+', modifiable: false },
        { id: '3', type: 'nombre', valeur: 3, modifiable: false },
        { id: '4', type: 'egal', valeur: '=', modifiable: false },
        { id: '5', type: 'nombre', valeur: 6, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(false);
  });

  it('devrait refuser un puzzle avec un trou non rempli', () => {
    const puzzle: Puzzle = {
      id: 'p1',
      difficulte: 'facile',
      tokens: [
        { id: '1', type: 'trou-nombre', valeur: '', valeurAttendue: 2, modifiable: true },
        { id: '2', type: 'operateur', valeur: '+', modifiable: false },
        { id: '3', type: 'nombre', valeur: 3, modifiable: false },
        { id: '4', type: 'egal', valeur: '=', modifiable: false },
        { id: '5', type: 'nombre', valeur: 5, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(false);
  });

  it('devrait respecter la priorité de la multiplication', () => {
    const puzzle: Puzzle = {
      id: 'p1',
      difficulte: 'avance',
      tokens: [
        { id: '1', type: 'nombre', valeur: 2, modifiable: false },
        { id: '2', type: 'operateur', valeur: '+', modifiable: false },
        { id: '3', type: 'nombre', valeur: 3, modifiable: false },
        { id: '4', type: 'operateur', valeur: '*', modifiable: false },
        { id: '5', type: 'nombre', valeur: 4, modifiable: false },
        { id: '6', type: 'egal', valeur: '=', modifiable: false },
        { id: '7', type: 'nombre', valeur: 14, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(true);
  });

  it('devrait refuser une division non entière', () => {
    const puzzle: Puzzle = {
      id: 'p1',
      difficulte: 'intermediaire',
      tokens: [
        { id: '1', type: 'nombre', valeur: 5, modifiable: false },
        { id: '2', type: 'operateur', valeur: '/', modifiable: false },
        { id: '3', type: 'nombre', valeur: 2, modifiable: false },
        { id: '4', type: 'egal', valeur: '=', modifiable: false },
        { id: '5', type: 'nombre', valeur: 2.5, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(false);
  });

  it('doit valider une division entière correcte', () => {
    const puzzle: Puzzle = {
      id: 'puzzle-test-1',
      difficulte: 'expert',
      tokens: [
        { id: '1', type: 'nombre', valeur: 8, modifiable: false },
        { id: '2', type: 'operateur', valeur: '/', modifiable: false },
        { id: '3', type: 'nombre', valeur: 2, modifiable: false },
        { id: '4', type: 'egal', valeur: '=', modifiable: false },
        { id: '5', type: 'nombre', valeur: 4, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(true);
  });

  it('doit refuser une division non entière', () => {
    const puzzle: Puzzle = {
      id: 'puzzle-test-2',
      difficulte: 'expert',
      tokens: [
        { id: '1', type: 'nombre', valeur: 7, modifiable: false },
        { id: '2', type: 'operateur', valeur: '/', modifiable: false },
        { id: '3', type: 'nombre', valeur: 2, modifiable: false },
        { id: '4', type: 'egal', valeur: '=', modifiable: false },
        { id: '5', type: 'nombre', valeur: 3.5, modifiable: false },
      ],
    };

    expect(service.estResolu(puzzle)).toBe(false);
  });
});
