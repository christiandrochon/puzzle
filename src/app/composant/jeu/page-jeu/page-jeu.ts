import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GenerateurPuzzleService } from '../../../moteur/services/generateur-puzzle';
import { ValidateurPuzzleService } from '../../../moteur/services/validateur-puzzle';
import { Puzzle } from '../../../moteur/modeles/puzzle';
import { Difficulte } from '../../../moteur/modeles/difficulte';

type NiveauAffichage = {
  cle: Difficulte;
  titre: string;
  description: string;
};

@Component({
  selector: 'app-page-jeu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './page-jeu.html',
  styleUrl: './page-jeu.scss',
})
export class PageJeu implements OnInit {
  private readonly generateurPuzzle = inject(GenerateurPuzzleService);
  private readonly validateurPuzzle = inject(ValidateurPuzzleService);

  puzzle: Puzzle | null = null;

  difficulteSelectionnee: Difficulte = 'facile';//niveau de depart par defaut
  numeroPuzzle = 0;

  message = '';
  typeMessage: 'succes' | 'erreur' | 'info' | '' = '';

  bonnesReponsesNiveau = 0;
  objectifBonnesReponses = 3; //3 bonnes reponses pour changer de niveau

  // Configuration des niveaux de difficulté pour l'affichage
  niveaux: NiveauAffichage[] = [
    {
      cle: 'facile',
      titre: 'Facile',
      description: 'Additions et soustractions simples',
    },
    {
      cle: 'intermediaire',
      titre: 'Intermédiaire',
      description: 'Multiplications, divisions entières et négatifs possibles',
    },
    {
      cle: 'avance',
      titre: 'Avancé',
      description: 'Deux opérations avec priorités opératoires',
    },
    {
      cle: 'expert',
      titre: 'Expert',
      description: 'Plusieurs trous, opérateurs cachés et réflexion renforcée',
    },
  ];

  ngOnInit(): void {
    this.chargerPuzzle();
  }

  /**
   * Choix manuel du niveau de difficulté, réinitialisation du compteur de bonnes réponses et chargement d'un nouveau puzzle
   * @param difficulte
   */
  choisirDifficulte(difficulte: Difficulte): void {
    this.difficulteSelectionnee = difficulte;
    this.bonnesReponsesNiveau = 0;
    this.chargerPuzzle();
    this.typeMessage = 'info';
    this.message = `Niveau ${this.libelleNiveau(this.difficulteSelectionnee)} sélectionné.`;
  }

  /**
   * Genere un nouveau puzzle en fonction de la difficulté sélectionnée et incrémente le numéro de puzzle pour l'affichage
   */
  chargerPuzzle(): void {
    this.puzzle = this.generateurPuzzle.generer(this.difficulteSelectionnee);
    this.numeroPuzzle++;
  }

  /**
   * Nettoie la valeur brute pour n'autoriser que les chiffres et un signe négatif au début.
   * @param token
   * @param valeurBrute
   */
  mettreAJourTrouNombre(token: { valeur?: string | number }, valeurBrute: string): void {
    const valeurNettoyee = valeurBrute.replace(/[^\d-]/g, '');

    // autoriser seulement un seul "-" et uniquement au début
    const signe = valeurNettoyee.startsWith('-') ? '-' : '';
    const chiffres = valeurNettoyee.replace(/-/g, '');

    token.valeur = signe + chiffres;
  }

  /**
   * Filtrage des carateres saisis au keydown
   * @param event appui sur touche de clavier
   */
  bloquerTouchesInvalides(event: KeyboardEvent): void {
    const touchesAutorisees = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
    ];

    if (touchesAutorisees.includes(event.key)) {
      return;
    }

    const estChiffre = /^[0-9]$/.test(event.key);
    const estMoins = event.key === '-';

    if (!estChiffre && !estMoins) {
      event.preventDefault();
    }
  }

  /**
   * Verifie le calcul et incrémente les bonnes réponses pour changer de niveau
   */
  verifier(): void {
    if (!this.puzzle) {
      return;
    }

    const estCorrect = this.validateurPuzzle.estResolu(this.puzzle);

    if (!estCorrect) {
      this.typeMessage = 'erreur';
      this.message = 'La réponse est fausse. Vérifie ton calcul.';
      return;
    }

    this.bonnesReponsesNiveau++;

    const niveauSuivant = this.obtenirNiveauSuivant(this.difficulteSelectionnee);
    const palierAtteint = this.bonnesReponsesNiveau >= this.objectifBonnesReponses;

    if (palierAtteint && niveauSuivant) {
      this.difficulteSelectionnee = niveauSuivant;
      this.bonnesReponsesNiveau = 0;
      this.chargerPuzzle();
      this.typeMessage = 'succes';
      this.message = `Bravo. Tu passes au niveau ${this.libelleNiveau(this.difficulteSelectionnee)}.`;
      return;
    }

    this.chargerPuzzle();

    if (palierAtteint && !niveauSuivant) {
      this.bonnesReponsesNiveau = this.objectifBonnesReponses;
      this.typeMessage = 'succes';
      this.message = 'Bravo. Tu as terminé le niveau expert.';
      return;
    }

    this.typeMessage = 'succes';
    this.message = `Bonne réponse. ${this.bonnesReponsesNiveau}/${this.objectifBonnesReponses} réussites sur ce niveau.`;
  }

  /**
   * Progressbar de bonnes questions repondues
   */
  progressionPourcentage(): number {
    return Math.min(
      100,
      Math.round((this.bonnesReponsesNiveau / this.objectifBonnesReponses) * 100),
    );
  }

  /**
   * Retourne le niveau de difficulté suivant ou null si on est déjà au niveau maximum
   * @param niveau
   * @private
   */
  private obtenirNiveauSuivant(niveau: Difficulte): Difficulte | null {
    const ordre: Difficulte[] = ['facile', 'intermediaire', 'avance', 'expert'];
    const indexActuel = ordre.indexOf(niveau);

    if (indexActuel === -1 || indexActuel === ordre.length - 1) {
      return null;
    }

    return ordre[indexActuel + 1];
  }

  /**
   * Retourne le libellé à afficher pour un niveau de difficulté
   * @param niveau
   */
  libelleNiveau(niveau: Difficulte): string {
    switch (niveau) {
      case 'facile':
        return 'facile';
      case 'intermediaire':
        return 'intermédiaire';
      case 'avance':
        return 'avancé';
      case 'expert':
        return 'expert';
    }
  }
}
