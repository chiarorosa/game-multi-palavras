// state.js
// Contém todas as variáveis que mudam durante o jogo.

let letterBag = [];
let playerHand = [];
let boardState = [];
let currentEnergy = 0;
let totalScore = 0;
let currentWordPoints = 0;
let currentWordMultis = 0;
let draggedLetterInfo = null;
let gameActive = true;
let targetScore = 60;

// Exporta o estado para leitura
export const state = {
  get letterBag() {
    return letterBag;
  },
  get playerHand() {
    return playerHand;
  },
  get boardState() {
    return boardState;
  },
  get currentEnergy() {
    return currentEnergy;
  },
  get totalScore() {
    return totalScore;
  },
  get currentWordPoints() {
    return currentWordPoints;
  },
  get currentWordMultis() {
    return currentWordMultis;
  },
  get draggedLetterInfo() {
    return draggedLetterInfo;
  },
  get gameActive() {
    return gameActive;
  },
  get targetScore() {
    return targetScore;
  },
};

// Exporta "setters" para modificar o estado de forma controlada
export function setLetterBag(newBag) {
  letterBag = newBag;
}
export function setPlayerHand(newHand) {
  playerHand = newHand;
}
export function setBoardState(newState) {
  boardState = newState;
}
export function setCurrentEnergy(value) {
  currentEnergy = value;
}
export function setTotalScore(value) {
  totalScore = value;
}
export function setCurrentWordPoints(value) {
  currentWordPoints = value;
}
export function setCurrentWordMultis(value) {
  currentWordMultis = value;
}
export function setDraggedLetterInfo(info) {
  draggedLetterInfo = info;
}
export function setGameActive(isActive) {
  gameActive = isActive;
}
export function setTargetScore(score) {
  targetScore = score;
}
