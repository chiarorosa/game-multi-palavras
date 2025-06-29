// src/js/config.js

// Constantes de regras do jogo
export const NUM_BOARD_SLOTS = 10;
export const NUM_HAND_SLOTS = 10;
export const INITIAL_ENERGY = 3;
export const SWAP_COST = 1;
export const MIN_VOWELS_IN_HAND = 3;
export const MAX_REFILL_ATTEMPTS = 30;
export const MIN_POSSIBLE_WORDS_FROM_HAND = 2;

// Constantes de letras
export const VOWELS = ["A", "E", "I", "O", "U"];

export const LETTER_VALUES = {
  A: 1,
  E: 1,
  I: 1,
  O: 1,
  S: 1,
  U: 1,
  M: 2,
  R: 2,
  T: 2,
  D: 3,
  L: 3,
  C: 3,
  P: 3,
  N: 4,
  B: 4,
  Ç: 5,
  F: 5,
  G: 5,
  H: 5,
  V: 5,
  J: 6,
  Q: 8,
  X: 8,
  Z: 8,
};

export const INITIAL_LETTER_BAG_DISTRIBUTION = {
  A: 14,
  E: 11,
  I: 10,
  O: 10,
  S: 8,
  U: 7,
  M: 6,
  R: 6,
  T: 5,
  D: 5,
  L: 5,
  C: 4,
  P: 4,
  N: 4,
  B: 3,
  Ç: 2,
  F: 2,
  G: 2,
  H: 2,
  V: 2,
  J: 2,
  Q: 1,
  X: 1,
  Z: 1,
};

export const BOARD_BONUS_CONFIG = [
  { type: "point", value: 1 },
  { type: "multi", value: 1 },
  { type: "multi", value: 1 },
  { type: "multi", value: 1 },
  null,
  { type: "multi", value: 1 },
  null,
  { type: "point", value: 1 },
  null,
  { type: "multi", value: 1 },
];
