import { Injectable } from '@angular/core';
import { Puzzle } from '../modeles/puzzle';
import { Token } from '../modeles/token';

@Injectable({
  providedIn: 'root',
})

/**
 * Service pour valider si un puzzle est résolu.
 * Un puzzle est considéré comme résolu si :
 * - Tous les tokens modifiables ont une valeur non vide.
 * - L'expression de gauche et de droite de l'égalité sont évaluées et égales.
 */
export class ValidateurPuzzleService {
  estResolu(puzzle: Puzzle): boolean {
    const tokens = puzzle.tokens;

    if (tokens.some((token) => token.modifiable && (token.valeur === '' || token.valeur == null))) {
      return false;
    }

    const indexEgal = tokens.findIndex((token) => token.type === 'egal');
    if (indexEgal === -1) {
      return false;
    }

    const coteGauche = tokens.slice(0, indexEgal);
    const coteDroite = tokens.slice(indexEgal + 1);

    const valeurGauche = this.evaluerTokens(coteGauche);
    const valeurDroite = this.evaluerTokens(coteDroite);

    return valeurGauche !== null && valeurDroite !== null && valeurGauche === valeurDroite;
  }

  private evaluerTokens(tokens: Token[]): number | null {
    const valeurs = tokens.map((token) => token.valeur);

    if (valeurs.length === 1) {
      const n = Number(valeurs[0]);
      return Number.isNaN(n) ? null : n;
    }

    if (valeurs.length === 3) {
      const a = Number(valeurs[0]);
      const op = String(valeurs[1]);
      const b = Number(valeurs[2]);

      if (Number.isNaN(a) || Number.isNaN(b)) {
        return null;
      }

      return this.appliquerOperation(a, op, b);
    }

    if (valeurs.length === 5) {
      const a = Number(valeurs[0]);
      const op1 = String(valeurs[1]);
      const b = Number(valeurs[2]);
      const op2 = String(valeurs[3]);
      const c = Number(valeurs[4]);

      if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c)) {
        return null;
      }

      return this.evaluerExpression3(a, op1, b, op2, c);
    }

    return null;
  }

  private evaluerExpression3(
    a: number,
    op1: string,
    b: number,
    op2: string,
    c: number,
  ): number | null {
    const priorite1 = this.priorite(op1);
    const priorite2 = this.priorite(op2);

    if (priorite2 > priorite1) {
      const droite = this.appliquerOperation(b, op2, c);

      if (droite === null) {
        return null;
      }

      return this.appliquerOperation(a, op1, droite);
    }

    const gauche = this.appliquerOperation(a, op1, b);

    if (gauche === null) {
      return null;
    }

    return this.appliquerOperation(gauche, op2, c);
  }

  private appliquerOperation(a: number, operateur: string, b: number): number | null {
    switch (operateur) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) {
          return null;
        }
        const resultat = a / b;
        return Number.isInteger(resultat) ? resultat : null;
      default:
        return null;
    }
  }

  private priorite(operateur: string): number {
    if (operateur === '*' || operateur === '/') {
      return 2;
    }

    if (operateur === '+' || operateur === '-') {
      return 1;
    }

    return 0;
  }
}
