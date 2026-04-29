import { Difficulte } from './difficulte';
import { Token } from './token';

/** * Représente un puzzle avec son identifiant, sa difficulté et les tokens qui le composent.
 */
export interface Puzzle {
  id: string;
  difficulte: Difficulte;
  tokens: Token[];
}
