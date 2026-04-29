import { Injectable } from '@angular/core';
import { Puzzle } from '../modeles/puzzle';
import { Difficulte } from '../modeles/difficulte';
import { Token } from '../modeles/token';

@Injectable({
  providedIn: 'root',
})

/**
 * Service de génération de puzzles mathématiques de différents niveaux de difficulté.
 * Chaque niveau de difficulté correspond à des règles spécifiques pour la construction des puzzles, notamment :
 * - Facile : expressions simples avec un seul opérateur, uniquement des nombres positifs, et un seul trou à remplir.
 * - Intermédiaire : expressions avec un opérateur parmi +, -, *, /, incluant des nombres négatifs, et un trou à remplir pouvant être un nombre ou un opérateur.
 * - Avancé : expressions avec deux opérations nécessitant de gérer les priorités opératoires, incluant des nombres négatifs, et un trou à remplir parmi les nombres.
 * - Expert : expressions plus complexes avec trois éléments modifiables (nombres ou opérateurs), nécessitant une réflexion approfondie pour garantir une solution unique.
 * Ce service crée des puzzles en construisant des expressions mathématiques, puis en masquant certains éléments
 * pour créer des "trous" que le joueur doit remplir. Les puzzles sont générés de manière à être valides et pertinents
 * pour chaque niveau de difficulté, avec des mécanismes spécifiques pour garantir la cohérence et la solvabilité.
 */
export class GenerateurPuzzleService {

  /**
   * Genere un nouveau puzzle en fonction de la difficulté sélectionnée, en appelant la méthode de génération correspondante pour chaque niveau de difficulté.
   * @param difficulte
   */
  generer(difficulte: Difficulte): Puzzle {
    switch (difficulte) {
      case 'facile':
        return this.genererPuzzleFacile();

      case 'intermediaire':
        return this.genererPuzzleIntermediaire();

      case 'avance':
        return this.genererPuzzleAvance();

      case 'expert':
        return this.genererPuzzleExpert();

      default:
        return this.genererPuzzleFacile();
    }
  }

  // =========================
  // FACILE
  // =========================

  /**
   * Genere un puzzle de niveau facile
   * @private
   */
  private genererPuzzleFacile(): Puzzle {
    const operateur = this.nombreAleatoire(0, 1) === 0 ? '+' : '-';

    let a = 0;
    let b = 0;
    let resultat = 0;

    if (operateur === '+') {
      a = this.nombreAleatoire(0, 9);
      b = this.nombreAleatoire(0, 9);
      resultat = a + b;
    } else {
      a = this.nombreAleatoire(0, 9);
      b = this.nombreAleatoire(0, a);
      resultat = a - b;
    }

    const tokens: Token[] = [
      this.tokenNombre(a),
      this.tokenOperateur(operateur),
      this.tokenNombre(b),
      this.tokenEgal(),
      this.tokenNombre(resultat),
    ];

    this.masquerTokensNombres(tokens, 1);

    return this.creerPuzzle('facile', tokens);
  }

  // =========================
  // INTERMEDIAIRE
  // =========================

  /**
   * Genere un puzzle de niveau interediaire
   *
   * @private
   */
  private genererPuzzleIntermediaire(): Puzzle {
    let tokens: Token[] = [];
    let puzzleValide = false;

    while (!puzzleValide) {
      const operateurs = ['+', '-', '*', '/'];
      const operateur = operateurs[this.nombreAleatoire(0, operateurs.length - 1)];

      let a = 0;
      let b = 0;
      let resultat = 0;

      if (operateur === '+') {
        a = this.nombreAleatoire(-20, 20);
        b = this.nombreAleatoire(-20, 20);
        resultat = a + b;
      } else if (operateur === '-') {
        a = this.nombreAleatoire(-20, 20);
        b = this.nombreAleatoire(-20, 20);
        resultat = a - b;
      } else if (operateur === '*') {
        a = this.nombreAleatoire(-10, 10);
        b = this.nombreAleatoire(-10, 10);
        resultat = a * b;
      } else {
        const division = this.genererDivisionEntiere(-12, 12, -12, 12);
        a = division.a;
        b = division.b;
        resultat = division.resultat;
      }

      tokens = [
        this.tokenNombre(a),
        this.tokenOperateur(operateur),
        this.tokenNombre(b),
        this.tokenEgal(),
        this.tokenNombre(resultat),
      ];

      this.masquerTokenIntermediaire(tokens);

      const trou = tokens.find((token) => token.modifiable);
      puzzleValide =
        !!trou && this.valeurMasqueeEstValide(trou) && this.puzzleSimpleEstPertinent(tokens);
    }

    return this.creerPuzzle('intermediaire', tokens);
  }

  // =========================
  // AVANCE
  // =========================

  /**
   * Genere un puzzle de niveau avancé
   * @private
   */
  private genererPuzzleAvance(): Puzzle {
    let tokens: Token[] = [];
    let puzzleValide = false;

    while (!puzzleValide) {
      const a = this.nombreAleatoire(-12, 12);
      const bloc2 = this.genererOperationBinaireValeur(-12, 12);
      const op1 = ['+', '-', '*'][this.nombreAleatoire(0, 2)];

      // let resultat = 0;
      //
      // if (op1 === '+') {
      //   resultat = a + bloc2.resultat;
      // } else if (op1 === '-') {
      //   resultat = a - bloc2.resultat;
      // } else {
      //   resultat = a * bloc2.resultat;
      // }
      const resultat = this.evaluerExpression3(a, op1, bloc2.gauche, bloc2.operateur, bloc2.droite);

      if (!Number.isInteger(resultat) || resultat < -100 || resultat > 100) {
        continue;
      }

      tokens = [
        this.tokenNombre(a),
        this.tokenOperateur(op1),
        this.tokenNombre(bloc2.gauche),
        this.tokenOperateur(bloc2.operateur),
        this.tokenNombre(bloc2.droite),
        this.tokenEgal(),
        this.tokenNombre(resultat),
      ];

      this.masquerTokenAvance(tokens);

      const trou = tokens.find((token) => token.modifiable);
      puzzleValide =
        !!trou && this.valeurMasqueeEstValide(trou) && this.expressionCompleteEstCoherente(tokens);
    }

    return this.creerPuzzle('avance', tokens);
  }

  // =========================
  // EXPERT
  // =========================

  /**
   * Genere un puzzle de niveau expert
   * @private
   */
  private genererPuzzleExpert(): Puzzle {
    let essais = 0;

    while (essais < 200) {
      essais++;

      const a = this.nombreAleatoire(1, 9);
      const b = this.nombreAleatoire(1, 9);
      const c = this.nombreAleatoire(1, 9);

      const operateurs = ['+', '-', '*'];
      const op1 = operateurs[this.nombreAleatoire(0, operateurs.length - 1)];
      const op2 = operateurs[this.nombreAleatoire(0, operateurs.length - 1)];

      const resultat = this.evaluerExpression3(a, op1, b, op2, c);

      if (!Number.isInteger(resultat) || resultat < 0 || resultat > 100) {
        continue;
      }

      const tokens: Token[] = [
        this.tokenNombre(a),
        this.tokenOperateur(op1),
        this.tokenNombre(b),
        this.tokenOperateur(op2),
        this.tokenNombre(c),
        this.tokenEgal(),
        this.tokenNombre(resultat),
      ];

      // En expert : 2 ou 3 trous, dont éventuellement un opérateur
      const typeMasquage = this.nombreAleatoire(0, 1);

      if (typeMasquage === 0) {
        this.masquerTokensMixtes(tokens, 2);
      } else {
        this.masquerTokensMixtes(tokens, 3);
      }

      if (this.aUneSolutionUnique(tokens)) {
        return this.creerPuzzle('expert', tokens);
      }
    }

    // secours
    return this.genererPuzzleAvanceCommeExpert();
  }

  private genererPuzzleAvanceCommeExpert(): Puzzle {
    const puzzle = this.genererPuzzleAvance();
    puzzle.difficulte = 'expert';
    return puzzle;
  }

  // =========================
  // TOKENS
  // =========================

  /**
   *
   * @param valeur
   * @private
   */
  private tokenNombre(valeur: number): Token {
    return {
      id: this.creerId(),
      type: 'nombre',
      valeur,
      modifiable: false,
    };
  }

  private tokenOperateur(valeur: string): Token {
    return {
      id: this.creerId(),
      type: 'operateur',
      valeur,
      modifiable: false,
    };
  }

  private tokenEgal(): Token {
    return {
      id: this.creerId(),
      type: 'egal',
      valeur: '=',
      modifiable: false,
    };
  }

  private creerPuzzle(difficulte: Difficulte, tokens: Token[]): Puzzle {
    return {
      id: this.creerId(),
      difficulte,
      tokens,
    };
  }

  // =========================
  // MASQUAGE
  // =========================

  private masquerTokensNombres(tokens: Token[], quantite: number): void {
    const indicesMasquables = tokens
      .map((token, index) => ({ token, index }))
      .filter((item) => item.token.type === 'nombre')
      .map((item) => item.index);

    this.melanger(indicesMasquables);

    const indicesChoisis = indicesMasquables.slice(0, quantite);

    for (const index of indicesChoisis) {
      const original = tokens[index];
      tokens[index] = {
        id: original.id,
        type: 'trou-nombre',
        valeur: '',
        valeurAttendue: original.valeur,
        modifiable: true,
      };
    }
  }

  private masquerTokensMixtes(tokens: Token[], quantite: number): void {
    const indicesMasquables = tokens
      .map((token, index) => ({ token, index }))
      .filter((item) => item.token.type === 'nombre' || item.token.type === 'operateur')
      .map((item) => item.index);

    this.melanger(indicesMasquables);

    const indicesChoisis = indicesMasquables.slice(0, quantite);

    for (const index of indicesChoisis) {
      const original = tokens[index];

      if (original.type === 'nombre') {
        tokens[index] = {
          id: original.id,
          type: 'trou-nombre',
          valeur: '',
          valeurAttendue: original.valeur,
          modifiable: true,
        };
      } else if (original.type === 'operateur') {
        tokens[index] = {
          id: original.id,
          type: 'trou-operateur',
          valeur: '',
          valeurAttendue: original.valeur,
          modifiable: true,
        };
      }
    }
  }

  // =========================
  // VALIDATION INTERNE EXPERT
  // =========================

  private aUneSolutionUnique(tokens: Token[]): boolean {
    const trous = tokens
      .map((token, index) => ({ token, index }))
      .filter((item) => item.token.modifiable);

    const valeursNumeriques = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const valeursOperateurs = ['+', '-', '*'];

    let solutions = 0;

    const explorer = (position: number): void => {
      if (solutions > 1) {
        return;
      }

      if (position >= trous.length) {
        if (this.expressionCompleteEstValide(tokens)) {
          solutions++;
        }
        return;
      }

      const trou = trous[position];

      if (trou.token.type === 'trou-nombre') {
        for (const valeur of valeursNumeriques) {
          tokens[trou.index].valeur = valeur;
          explorer(position + 1);
        }
        tokens[trou.index].valeur = '';
      } else {
        for (const operateur of valeursOperateurs) {
          tokens[trou.index].valeur = operateur;
          explorer(position + 1);
        }
        tokens[trou.index].valeur = '';
      }
    };

    explorer(0);

    return solutions === 1;
  }

  private expressionCompleteEstValide(tokens: Token[]): boolean {
    const indexEgal = tokens.findIndex((token) => token.type === 'egal');
    if (indexEgal === -1) {
      return false;
    }

    const gauche = tokens.slice(0, indexEgal);
    const droite = tokens.slice(indexEgal + 1);

    const valeurGauche = this.evaluerTokens(gauche);
    const valeurDroite = this.evaluerTokens(droite);

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

  // =========================
  // CALCUL
  // =========================

  private evaluerExpression3(a: number, op1: string, b: number, op2: string, c: number): number {
    const priorite1 = this.priorite(op1);
    const priorite2 = this.priorite(op2);

    if (priorite2 > priorite1) {
      const droite = this.appliquerOperation(b, op2, c);
      return this.appliquerOperation(a, op1, droite);
    }

    const gauche = this.appliquerOperation(a, op1, b);
    return this.appliquerOperation(gauche, op2, c);
  }

  private appliquerOperation(a: number, operateur: string, b: number): number {
    switch (operateur) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) {
          return NaN;
        }

        const resultat = a / b;
        return Number.isInteger(resultat) ? resultat : NaN;
      default:
        return NaN;
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

  // =========================
  // OUTILS
  // =========================

  private nombreAleatoire(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private melanger(tableau: number[]): void {
    for (let i = tableau.length - 1; i > 0; i--) {
      const j = this.nombreAleatoire(0, i);
      [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
  }

  private creerId(): string {
    return crypto.randomUUID();
  }

  private genererDivisionEntiere(
    minQuotient: number,
    maxQuotient: number,
    minDiviseur: number,
    maxDiviseur: number,
  ): { a: number; b: number; resultat: number } {
    let quotient = 0;
    let diviseur = 0;
    let dividende = 0;

    do {
      quotient = this.nombreAleatoire(minQuotient, maxQuotient);
      diviseur = this.nombreAleatoire(minDiviseur, maxDiviseur);
    } while (diviseur === 0);

    dividende = quotient * diviseur;

    return {
      a: dividende,
      b: diviseur,
      resultat: quotient,
    };
  }

  private genererOperationBinaireValeur(
    min: number,
    max: number,
  ): { gauche: number; operateur: string; droite: number; resultat: number } {
    const operateurs = ['+', '-', '*', '/'];

    while (true) {
      const operateur = operateurs[this.nombreAleatoire(0, operateurs.length - 1)];

      let gauche = 0;
      let droite = 0;
      let resultat = 0;

      if (operateur === '+') {
        gauche = this.nombreAleatoire(min, max);
        droite = this.nombreAleatoire(min, max);
        resultat = gauche + droite;
      } else if (operateur === '-') {
        gauche = this.nombreAleatoire(min, max);
        droite = this.nombreAleatoire(min, max);
        resultat = gauche - droite;
      } else if (operateur === '*') {
        gauche = this.nombreAleatoire(-10, 10);
        droite = this.nombreAleatoire(-10, 10);
        resultat = gauche * droite;
      } else {
        const division = this.genererDivisionEntiere(-10, 10, -10, 10);
        gauche = division.a;
        droite = division.b;
        resultat = division.resultat;
      }

      if (Number.isInteger(resultat) && resultat >= -30 && resultat <= 30) {
        return { gauche, operateur, droite, resultat };
      }
    }
  }

  private masquerTokenIntermediaire(tokens: Token[]): void {
    const choixPossibles = [0, 2, 2, 2, 4];
    const index = choixPossibles[this.nombreAleatoire(0, choixPossibles.length - 1)];
    const original = tokens[index];

    tokens[index] = {
      id: original.id,
      type: 'trou-nombre',
      valeur: '',
      valeurAttendue: original.valeur,
      modifiable: true,
    };
  }

  private masquerTokenAvance(tokens: Token[]): void {
    const indicesMasquables = [0, 2, 4, 6];
    this.melanger(indicesMasquables);

    const index = indicesMasquables[0];
    const original = tokens[index];

    tokens[index] = {
      id: original.id,
      type: 'trou-nombre',
      valeur: '',
      valeurAttendue: original.valeur,
      modifiable: true,
    };
  }

  private valeurMasqueeEstValide(token: Token): boolean {
    if (token.type !== 'trou-nombre') {
      return true;
    }

    const valeur = Number(token.valeurAttendue);
    return Number.isInteger(valeur) && valeur >= -100 && valeur <= 100;
  }

  private puzzleSimpleEstPertinent(tokens: Token[]): boolean {
    const nombres = tokens
      .filter((token) => token.type === 'nombre' || token.type === 'trou-nombre')
      .map((token) => Number(token.valeur ?? token.valeurAttendue));

    if (nombres.some((n) => Number.isNaN(n))) {
      return false;
    }

    const zeros = nombres.filter((n) => n === 0).length;
    if (zeros >= 2) {
      return false;
    }

    return true;
  }

  private expressionCompleteEstCoherente(tokens: Token[]): boolean {
    const indexEgal = tokens.findIndex((token) => token.type === 'egal');
    if (indexEgal === -1) {
      return false;
    }

    const gauche = tokens.slice(0, indexEgal);
    const droite = tokens.slice(indexEgal + 1);

    const valeurGauche = this.evaluerTokensComplets(gauche);
    const valeurDroite = this.evaluerTokensComplets(droite);

    return (
      valeurGauche !== null &&
      valeurDroite !== null &&
      Number.isInteger(valeurGauche) &&
      Number.isInteger(valeurDroite) &&
      valeurGauche === valeurDroite
    );
  }

  private evaluerTokensComplets(tokens: Token[]): number | null {
    const valeurs = tokens.map((token) => token.valeur ?? token.valeurAttendue);

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

      return this.appliquerOperationComplete(a, op, b);
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

      return this.evaluerExpression3Complete(a, op1, b, op2, c);
    }

    return null;
  }

  private appliquerOperationComplete(a: number, operateur: string, b: number): number | null {
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

  private evaluerExpression3Complete(
    a: number,
    op1: string,
    b: number,
    op2: string,
    c: number,
  ): number | null {
    const priorite1 = this.prioriteOperation(op1);
    const priorite2 = this.prioriteOperation(op2);

    if (priorite2 > priorite1) {
      const droite = this.appliquerOperationComplete(b, op2, c);
      if (droite === null) {
        return null;
      }

      return this.appliquerOperationComplete(a, op1, droite);
    }

    const gauche = this.appliquerOperationComplete(a, op1, b);
    if (gauche === null) {
      return null;
    }

    return this.appliquerOperationComplete(gauche, op2, c);
  }

  private prioriteOperation(operateur: string): number {
    if (operateur === '*' || operateur === '/') {
      return 2;
    }

    if (operateur === '+' || operateur === '-') {
      return 1;
    }

    return 0;
  }
}
