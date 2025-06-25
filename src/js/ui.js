// ui.js
// Responsável por toda a manipulação do DOM e atualização da interface.

import { state } from "./state.js";
import * as config from "./config.js";
import {
  handleDragStartBoardLetter,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDropOnBoardSlot,
} from "./gameLogic.js";

// Seletores de elementos do DOM
export const boardElement = document.getElementById("board");
export const playerHandElement = document.getElementById("player-hand");
export const currentWordPointsElement = document.getElementById(
  "current-word-points"
);
export const currentWordMultisElement = document.getElementById(
  "current-word-multis"
);
export const totalScoreElement = document.getElementById("total-score");
export const currentEnergyElement = document.getElementById("current-energy");
export const scoreTargetValueElement =
  document.getElementById("score-target-value");
export const playButton = document.getElementById("play-button");
export const swapLettersButton = document.getElementById("swap-letters-button");
export const clearWordButton = document.getElementById("clear-word-button");
export const sortAlphaButton = document.getElementById("sort-alpha-button");
export const gameOverPopup = document.getElementById("game-over-popup");
export const finalScoreElement = document.getElementById("final-score");
export const restartButton = document.getElementById("restart-button");
export const menuButton = document.getElementById("menu-button");
export const messageArea = document.getElementById("message-area");
export const possibleWordsCounterElement = document.getElementById(
  "possible-words-counter"
); // Elemento adicionado

let messageTimeout;

export function showMessage(text, duration = 2000) {
  clearTimeout(messageTimeout);
  messageArea.textContent = text;
  messageArea.classList.add("visible");
  messageTimeout = setTimeout(
    () => messageArea.classList.remove("visible"),
    duration
  );
}

export function renderBoard() {
  boardElement.innerHTML = "";
  state.boardState.forEach((slotContent, index) => {
    const slotDiv = document.createElement("div");
    slotDiv.classList.add("board-slot");
    slotDiv.dataset.index = index;
    if (slotContent) {
      const letterCharDiv = document.createElement("div");
      letterCharDiv.classList.add("letter-char");
      letterCharDiv.textContent = slotContent.letter;
      slotDiv.appendChild(letterCharDiv);
      slotDiv.classList.add("has-letter");
      slotDiv.draggable = true;
      const valueSpan = document.createElement("span");
      valueSpan.classList.add("value");
      valueSpan.textContent = config.LETTER_VALUES[slotContent.letter];
      slotDiv.appendChild(valueSpan);
      slotDiv.addEventListener("dragstart", handleDragStartBoardLetter);
    }
    const bonus = config.BOARD_BONUS_CONFIG[index];
    if (bonus) {
      const pip = document.createElement("div");
      pip.classList.add("bonus-pip", bonus.type);
      slotDiv.appendChild(pip);
    }
    slotDiv.addEventListener("dragover", handleDragOver);
    slotDiv.addEventListener("dragenter", handleDragEnter);
    slotDiv.addEventListener("dragleave", handleDragLeave);
    slotDiv.addEventListener("drop", handleDropOnBoardSlot);
    boardElement.appendChild(slotDiv);
  });
}

// Função interna para renderizar as peças
function renderHand() {
  playerHandElement.innerHTML = "";
  state.playerHand.forEach((tile) => {
    if (!tile) return;
    const tileDiv = document.createElement("div");
    tileDiv.classList.add("letter-tile");
    tileDiv.textContent = tile.letter;
    tileDiv.draggable = true;
    tileDiv.dataset.handId = tile.id;
    tileDiv.dataset.letter = tile.letter;
    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");
    valueSpan.textContent = config.LETTER_VALUES[tile.letter];
    tileDiv.appendChild(valueSpan);
    // Listeners são adicionados no main.js via MutationObserver
    playerHandElement.appendChild(tileDiv);
  });
}

// Nova função para atualizar o contador
export function renderPossibleWordsCount(count) {
  if (possibleWordsCounterElement) {
    possibleWordsCounterElement.innerHTML = `Palavras: <span>${count}</span>`;
  }
}

// Nova função "master" para atualizar a UI da mão
export function updateHandUI(wordCount) {
  renderHand();
  renderPossibleWordsCount(wordCount);
}

export function renderStats() {
  currentWordPointsElement.textContent = state.currentWordPoints;
  currentWordMultisElement.textContent = state.currentWordMultis;
  totalScoreElement.textContent = state.totalScore;
  currentEnergyElement.textContent = state.currentEnergy;
  if (scoreTargetValueElement)
    scoreTargetValueElement.textContent = state.targetScore;

  const isBoardEmpty = state.boardState.every((s) => s === null);
  playButton.disabled = !state.gameActive || isBoardEmpty;
  clearWordButton.disabled = !state.gameActive || isBoardEmpty;
  swapLettersButton.disabled =
    !state.gameActive ||
    state.currentEnergy < config.SWAP_COST ||
    state.playerHand.length === 0;
  sortAlphaButton.disabled = !state.gameActive || state.playerHand.length === 0;
}
