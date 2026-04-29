# Puzzle Chenille — Application Angular

---

## Description

Application web Angular proposant un jeu de logique basé sur des expressions mathématiques incomplètes.

L’utilisateur doit compléter une “chenille” composée de nombres et d’opérateurs afin de reconstituer une égalité mathématique valide.

Exemple :

```
7 + 5 * ? = 22
```

---

## Objectifs

- Résolution de problèmes mathématiques
- Manipulation d’opérations arithmétiques
- Progression par niveaux
- Validation logique stricte (pas uniquement visuelle)

---

## Règles du jeu

### Structure

Une expression est composée de :

```
nombre opérateur nombre ... = résultat
```

Certains éléments sont masqués.

---

### Types de trous

#### Trou numérique

- Entiers uniquement
- Nombres négatifs autorisés
- Décimaux interdits

#### Trou opérateur

Choix possible :

```
+  -  *  /
```

---

### Contraintes métier

#### Division

- Autorisée uniquement si résultat entier
- Exemple valide : `8 / 2 = 4`
- Exemple rejeté : `7 / 2 = 3.5`

#### Division par zéro

- Interdite

#### Validation

- Basée sur un moteur de calcul
- Ne dépend pas de l’interface utilisateur
- Aucun usage de `eval()`

---

## Niveaux de difficulté

| Niveau        | Description                        |
|--------------|----------------------------------|
| Facile       | Additions simples                 |
| Intermédiaire| + et -                            |
| Avancé       | + - *                             |
| Expert       | + - * / avec contraintes strictes |

---

## Architecture

### Architecture cible (conception initiale)

```
src/app/
  fonctionnalites/
    jeu/
      page-jeu/
        page-jeu.component.ts
        page-jeu.component.html
        page-jeu.component.scss
      ui/
        plateau-chenille/
        segment-chenille/
        panneau-resultat/
        panneau-score/

  moteur/
    services/
      generateur-puzzle.service.ts
      validateur-puzzle.service.ts
      session-jeu.service.ts

    modeles/
      token.ts
      puzzle.ts
      difficulte.ts
```

---

### Rôle des couches

#### fonctionnalites/jeu

Contient :

- la page principale (`page-jeu`)
- la logique d’affichage
- la gestion des interactions utilisateur

---

#### ui (prévu mais non utilisé)

Objectif initial :

- découper l’interface en composants réutilisables
- isoler le rendu

Composants prévus :

- plateau-chenille : affichage global
- segment-chenille : unité visuelle
- panneau-resultat : feedback utilisateur
- panneau-score : progression

Décision finale :

- non utilisé volontairement

Raisons :

- application simple (test technique)
- éviter la sur-architecture
- `page-jeu` couvre le besoin

Cela reste une évolution naturelle si le projet grandit.

---

#### moteur

Cœur métier indépendant de l’UI

##### Services

generateur-puzzle.service.ts

- génère des puzzles valides
- respecte les contraintes mathématiques
- garantit un résultat cohérent

validateur-puzzle.service.ts

- reconstruit l’expression
- applique les priorités opératoires
- valide le résultat final

session-jeu.service.ts

- gère la progression
- niveau courant
- enchaînement des puzzles

---

##### Modèles

token.ts

- unité de base (nombre / opérateur / trou)

puzzle.ts

- structure complète d’un puzzle

difficulte.ts

- définition des niveaux

---

### Architecture réellement utilisée

- `page-jeu` centralise :
  - affichage
  - interaction
  - orchestration

- les services du moteur sont pleinement utilisés

- `ui/` non implémenté volontairement

---

### Analyse critique

Points positifs :

- séparation UI / logique métier
- services testables
- architecture extensible

Arbitrage :

- simplification UI
- réduction du coût cognitif
- éviter sur-découpage Angular

Choix cohérent avec un test technique.

---

### Évolution possible

```
page-jeu
  → plateau-chenille
      → segment-chenille
  → panneau-resultat
  → panneau-score
```

---

## Diagramme logique

```
[ UI - page-jeu ]
        ↓
[ session-jeu.service ]
        ↓
[ generateur-puzzle.service ]
        ↓
[ validateur-puzzle.service ]
        ↓
[ résultat affiché ]
```

---

## Modélisation

### Token

```ts
type Token = {
  id: number;
  valeur?: number | string;
  modifiable: boolean;
  type: 'nombre' | 'operateur' | 'trou-nombre' | 'trou-operateur';
};
```

---

### Puzzle

```ts
type Puzzle = {
  tokens: Token[];
  resultat: number;
  niveau: number;
};
```

---

## Services métier

### Générateur

Responsabilités :

- génération d’expressions valides
- respect des contraintes
- adaptation au niveau

Points critiques :

- éviter les équations impossibles
- garantir des divisions entières

---

### Validateur

Responsabilités :

- reconstruire l’expression
- appliquer les priorités
- vérifier le résultat

Méthode centrale :

```ts
appliquerOperation(a: number, operateur: string, b: number): number | null
```

Règles :

- `/` retourne `null` si non entier
- `/` interdit si division par zéro

---

## Moteur de calcul

### Priorités opératoires

Deux passes :

1. `*` et `/`
2. `+` et `-`

Cela évite :

- erreurs de calcul
- dépendance à `eval()`

---

## Saisie utilisateur

### Problème

`input type="number"` :

- accepte `e`
- accepte `.`
- comportement variable selon navigateur

---

### Solution

```html
<input type="text" inputmode="numeric" />
```

Nettoyage :

```ts
valeur.replace(/[^\d-]/g, '')
```

Règles :

- chiffres uniquement
- un seul `-`
- uniquement en première position

---

### Double validation

1. filtrage UI
2. validation métier

---

## Interface utilisateur

- représentation en chenille
- segments interactifs
- feedback utilisateur
- niveaux visuellement séparés

---

## Lancement

### Prérequis

- Node.js >= 20
- Angular CLI

---

### Installation

```bash
npm install
```

---

### Lancement

```bash
npm run ng serve
```

ou

```bash
npx ng serve
```

---

Accès :

```
http://localhost:4200
```

---

## Contraintes techniques

Angular CLI :

```
Node >= 20.19.0
```

---

## Choix techniques

### Angular

- séparation composants / services / modèles
- architecture scalable

---

### SCSS

- lisibilité
- séparation structure / style
- plus adapté à un test technique que Tailwind

---

### Refus de eval

Motifs :

- sécurité
- contrôle métier
- validation fine des divisions

---

## Qualité logicielle

Points forts :

- séparation des responsabilités
- logique isolée
- validation robuste

---

### Cas gérés

- division non entière
- division par zéro
- nombres négatifs
- saisie invalide
- priorités opératoires

---

## Limites

- pas de backend
- pas de persistance
- pas de tests unitaires
- génération simple

---

## Améliorations possibles

- tests unitaires
- backend (score, progression)
- difficulté adaptative
- amélioration UX
- accessibilité

---

## Gestion de l’état

Pas de NgRx

Raisons :

- état simple
- éviter complexité inutile

Approche :

- logique dans services
- orchestration dans page-jeu

---

### Pourquoi pas NgRx

NgRx utile si :

- état global complexe
- effets asynchrones nombreux
- multi-écrans

Non nécessaire ici.

---

### Signals

Possibles mais non nécessaires :

- état simple
- peu de réactivité complexe

---

### Logique de décision

Utiliser l’outil le plus simple :

- services
- modèles
- composant central

---

### Bénéfices

- lisibilité
- simplicité
- maintenabilité

---

### Évolution

Possible si :

- ajout de persistance
- multi-pages
- statistiques
- comptes utilisateurs

---

## Conclusion

Projet démontrant :

- séparation UI / logique métier
- moteur de calcul robuste
- gestion stricte des contraintes mathématiques

Architecture volontairement simple, adaptée à un test technique, tout en restant extensible.
