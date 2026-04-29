export type TypeToken = 'nombre' | 'operateur' | 'egal' | 'trou-nombre' | 'trou-operateur';

/** * Représente un token dans un puzzle, avec son identifiant, son type, sa valeur actuelle (si applicable), sa valeur attendue (pour les trous) et une indication de modifiabilité.
 */
export interface Token {
  id: string;
  type: TypeToken;
  valeur?: string | number;
  valeurAttendue?: string | number;
  modifiable: boolean;
}
