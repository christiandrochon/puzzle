import { TestBed } from '@angular/core/testing';

import { GenerateurPuzzleService } from './generateur-puzzle';
import { ValidateurPuzzleService } from './validateur-puzzle';
import { Difficulte } from '../modeles/difficulte';

describe('GenerateurPuzzle', () => {
  let generateur: GenerateurPuzzleService;
  let validateur: ValidateurPuzzleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    generateur = TestBed.inject(GenerateurPuzzleService);
    validateur = TestBed.inject(ValidateurPuzzleService);
  });

  it('doit générer un puzzle facile avec au moins un trou modifiable', () => {
    const puzzle = generateur.generer('facile');

    const trous = puzzle.tokens.filter((token) => token.modifiable);

    expect(puzzle).toBeTruthy();
    expect(puzzle.difficulte).toBe('facile');
    expect(puzzle.tokens.length).toBeGreaterThan(0);
    expect(trous.length).toBeGreaterThan(0);
  });

  it('devrait générer un puzzle facile avec 5 tokens et 1 trou', () => {
    const puzzle = generateur.generer('facile');

    expect(puzzle).toBeDefined();
    expect(puzzle.difficulte).toBe('facile');
    expect(puzzle.tokens).toHaveLength(5);

    const trous = puzzle.tokens.filter((token) => token.modifiable);

    expect(trous).toHaveLength(1);
    expect(trous[0].type).toBe('trou-nombre');
    expect(trous[0].valeur).toBe('');
    expect(trous[0].valeurAttendue).toBeDefined();
  });

  it('devrait générer un puzzle pour chaque difficulté', () => {
    const difficultes: Difficulte[] = ['facile', 'intermediaire', 'avance', 'expert'];

    for (const difficulte of difficultes) {
      const puzzle = generateur.generer(difficulte);

      expect(puzzle).toBeDefined();
      expect(puzzle.id).toBeDefined();
      expect(puzzle.difficulte).toBe(difficulte);
      expect(puzzle.tokens.length).toBeGreaterThan(0);
    }
  });

  it('devrait générer des puzzles contenant exactement un symbole égal', () => {
    const difficultes: Difficulte[] = ['facile', 'intermediaire', 'avance', 'expert'];

    for (const difficulte of difficultes) {
      const puzzle = generateur.generer(difficulte);

      const egal = puzzle.tokens.filter((token) => token.type === 'egal');

      expect(egal).toHaveLength(1);
      expect(egal[0].valeur).toBe('=');
      expect(egal[0].modifiable).toBe(false);
    }
  });

  it('devrait rendre le puzzle résolu quand on remplit les trous avec les valeurs attendues', () => {
    const difficultes: Difficulte[] = ['facile', 'intermediaire', 'avance', 'expert'];

    for (const difficulte of difficultes) {
      const puzzle = generateur.generer(difficulte);

      for (const token of puzzle.tokens) {
        if (token.modifiable) {
          expect(token.valeurAttendue).toBeDefined();
          token.valeur = token.valeurAttendue;
        }
      }

      expect(validateur.estResolu(puzzle)).toBe(true);
    }
  });

  it('devrait générer 100 puzzles valides une fois les trous remplis', () => {
    const difficultes: Difficulte[] = ['facile', 'intermediaire', 'avance', 'expert'];

    for (let i = 0; i < 100; i++) {
      for (const difficulte of difficultes) {
        const puzzle = generateur.generer(difficulte);

        for (const token of puzzle.tokens) {
          if (token.modifiable) {
            expect(
              token.valeurAttendue,
              `valeurAttendue manquante (iter=${i}, ${difficulte}) pour token ${JSON.stringify(token)}`
            ).toBeDefined();
            token.valeur = token.valeurAttendue == null ? '' : String(token.valeurAttendue);
          }
        }

        expect(
          validateur.estResolu(puzzle),
          `puzzle non resolu (iter=${i}, ${difficulte}) - tokens: ${JSON.stringify(puzzle.tokens)}`
        ).toBe(true);
      }
    }
  });

  it('devrait générer un puzzle avancé avec 7 tokens et 1 trou nombre', () => {
    const puzzle = generateur.generer('avance');

    expect(puzzle.difficulte).toBe('avance');
    expect(puzzle.tokens).toHaveLength(7);

    const trous = puzzle.tokens.filter((token) => token.modifiable);

    expect(trous).toHaveLength(1);
    expect(trous[0].type).toBe('trou-nombre');
  });

  it('devrait générer un puzzle expert avec au moins 2 trous', () => {
    const puzzle = generateur.generer('expert');

    expect(puzzle.difficulte).toBe('expert');

    const trous = puzzle.tokens.filter((token) => token.modifiable);

    expect(trous.length).toBeGreaterThanOrEqual(1);
  });
});
