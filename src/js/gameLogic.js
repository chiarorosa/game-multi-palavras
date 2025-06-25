// gameLogic.js
// Contém a lógica principal do jogo, regras e manipulação do estado.

import * as config from "./config.js";
import {
  state,
  setLetterBag,
  setPlayerHand,
  setBoardState,
  setCurrentEnergy,
  setTotalScore,
  setCurrentWordPoints,
  setCurrentWordMultis,
  setDraggedLetterInfo,
  setGameActive,
  setTargetScore,
} from "./state.js";
import * as ui from "./ui.js";
import * as utils from "./utils.js";

// --- Funções de Lógica Pura e Regras ---

function canFormWord(word, handLettersList) {
  const available = [...handLettersList];
  for (const char of word.toUpperCase()) {
    const index = available.indexOf(char);
    if (index === -1) return false;
    available.splice(index, 1);
  }
  return true;
}

function countPossibleDictionaryWords(handTilesArray) {
  if (!handTilesArray || handTilesArray.length === 0) return 0;
  const handLetters = handTilesArray
    .map((tile) => (tile ? tile.letter : ""))
    .filter(Boolean);
  let count = 0;
  for (const word of config.DICTIONARY) {
    if (
      word.length > 0 &&
      word.length <= handLetters.length &&
      canFormWord(word, handLetters)
    ) {
      count++;
    }
  }
  return count;
}

function isValidWord(word) {
  if (word.length < 2) return false;
  return config.DICTIONARY.includes(word.toUpperCase());
}

// --- Funções que Modificam o Estado do Jogo ---

export function createLetterBag() {
  const newBag = [];
  for (const letter in config.INITIAL_LETTER_BAG_DISTRIBUTION) {
    for (let i = 0; i < config.INITIAL_LETTER_BAG_DISTRIBUTION[letter]; i++)
      newBag.push(letter);
  }
  utils.shuffleArray(newBag);
  setLetterBag(newBag);
}

function drawLettersFromBag(count) {
  const bag = state.letterBag;
  const drawn = [];
  for (let i = 0; i < count; i++) {
    if (bag.length === 0) break;
    drawn.push(bag.pop());
  }
  setLetterBag(bag);
  return drawn.map((letter) => ({ letter, id: utils.generateUniqueId() }));
}

export function refillHand() {
  let currentHand = [...state.playerHand.filter(Boolean)];

  for (let attempt = 0; attempt < config.MAX_REFILL_ATTEMPTS; attempt++) {
    let attemptHand = [...currentHand];
    let tempBag = [...state.letterBag];
    utils.shuffleArray(tempBag);

    const needed = config.NUM_HAND_SLOTS - attemptHand.length;
    if (needed > 0) {
      const drawnLetters = drawLettersFromBag(needed);
      attemptHand.push(...drawnLetters);
    }

    const hasEnoughVowels =
      attemptHand.reduce(
        (acc, tile) => acc + (config.VOWELS.includes(tile.letter) ? 1 : 0),
        0
      ) >= config.MIN_VOWELS_IN_HAND;
    const possibleWordsCount = countPossibleDictionaryWords(attemptHand);

    if (
      attemptHand.length === config.NUM_HAND_SLOTS &&
      hasEnoughVowels &&
      possibleWordsCount >= config.MIN_POSSIBLE_WORDS_FROM_HAND
    ) {
      setPlayerHand(attemptHand);
      setLetterBag(tempBag);
      ui.renderHand(); // A UI da mão é atualizada aqui
      return;
    }
  }

  console.warn(
    `Fallback: Não foi possível gerar mão ideal. Preenchendo da melhor forma possível.`
  );
  const neededFinally = config.NUM_HAND_SLOTS - currentHand.length;
  if (neededFinally > 0) {
    currentHand.push(...drawLettersFromBag(neededFinally));
  }
  setPlayerHand(currentHand);
  ui.renderHand();
}

export function calculateAndUpdateWordScore() {
  let points = 0;
  let multis = 0;
  let wordFormed = false;
  state.boardState.forEach((slotContent, index) => {
    if (slotContent) {
      wordFormed = true;
      points += config.LETTER_VALUES[slotContent.letter];
      const bonus = config.BOARD_BONUS_CONFIG[index];
      if (bonus) {
        if (bonus.type === "point") points += bonus.value;
        if (bonus.type === "multi") multis += bonus.value;
      }
    }
  });
  setCurrentWordPoints(wordFormed ? points : 0);
  setCurrentWordMultis(wordFormed ? multis : 0);
  ui.renderStats();
}

function processValidWord(word) {
  const scoreFromWord = state.currentWordPoints * (1 + state.currentWordMultis);
  setTotalScore(state.totalScore + scoreFromWord);
  setCurrentEnergy(state.currentEnergy - 1);

  const energyBeforeMeta = state.currentEnergy;

  if (state.totalScore >= state.targetScore) {
    const fixedBonus = 3;
    const remainderBonus = Math.max(0, energyBeforeMeta);
    setCurrentEnergy(state.currentEnergy + fixedBonus + remainderBonus);
    setTargetScore(state.targetScore + 60);
    ui.showMessage(
      `META! +${fixedBonus} Energia +${remainderBonus} Bônus! Próxima meta: ${state.targetScore} pts`,
      4000
    );
  } else {
    ui.showMessage(`"${word}" +${scoreFromWord} pts!`, 2000);
  }

  setBoardState(Array(config.NUM_BOARD_SLOTS).fill(null));
  refillHand();
  checkGameOver();
}

export function mixWord() {
  if (!state.gameActive) return;
  const word = state.boardState.map((s) => (s ? s.letter : "")).join("");
  if (word.length === 0) {
    ui.showMessage("Forme uma palavra primeiro!", 1500);
    return;
  }

  if (isValidWord(word)) {
    processValidWord(word.toUpperCase());
  } else {
    ui.showMessage(`"${word}" não é válida!`, 2000);
  }
  ui.renderBoard();
  calculateAndUpdateWordScore();
}

export function swapLetters() {
  if (
    !state.gameActive ||
    state.currentEnergy < config.SWAP_COST ||
    state.playerHand.length === 0
  ) {
    ui.showMessage(
      state.playerHand.length === 0 ? "Mão vazia!" : "Energia insuficiente!",
      1500
    );
    return;
  }
  setCurrentEnergy(state.currentEnergy - config.SWAP_COST);
  const currentBag = state.letterBag;
  state.playerHand.forEach((tile) => {
    if (tile) currentBag.push(tile.letter);
  });
  utils.shuffleArray(currentBag);
  setLetterBag(currentBag);
  setPlayerHand([]);
  refillHand();
  ui.showMessage("Letras trocadas!", 1500);
  checkGameOver();
}

export function clearWordFromBoard() {
  if (!state.gameActive) return;
  let lettersMoved = false;
  const currentHand = [...state.playerHand];
  const newBoard = [...state.boardState];

  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i]) {
      currentHand.push(newBoard[i]);
      newBoard[i] = null;
      lettersMoved = true;
    }
  }
  if (lettersMoved) {
    setBoardState(newBoard);
    setPlayerHand(currentHand);
    ui.renderBoard();
    sortHandAlpha();
  }
}

export function sortHandAlpha() {
  if (!state.gameActive) return;
  const sortedHand = [...state.playerHand].sort((a, b) =>
    a && b ? a.letter.localeCompare(b.letter) : 0
  );
  setPlayerHand(sortedHand);
  ui.renderHand();
}

export function checkGameOver() {
  if (state.currentEnergy <= 0) {
    setGameActive(false);
    ui.finalScoreElement.textContent = state.totalScore;
    ui.gameOverPopup.classList.remove("hidden");
    ui.showMessage("Fim de Jogo!", 3000);
  }
  ui.renderStats();
}

export function initializeGame() {
  setGameActive(true);
  setCurrentEnergy(config.INITIAL_ENERGY);
  setTotalScore(0);
  setCurrentWordPoints(0);
  setCurrentWordMultis(0);
  setTargetScore(60);
  setBoardState(Array(config.NUM_BOARD_SLOTS).fill(null));

  createLetterBag();
  setPlayerHand([]);
  refillHand();
  ui.gameOverPopup.classList.add("hidden");
  document.getElementById("swap-cost").textContent = `${config.SWAP_COST}⚡`;
  ui.renderBoard();
  calculateAndUpdateWordScore();
}

// --- Lógica de Drag and Drop ---

export function handleDragStartHandLetter(event) {
  if (!state.gameActive) {
    event.preventDefault();
    return;
  }
  event.target.classList.add("dragging");
  setDraggedLetterInfo({
    letter: event.target.dataset.letter,
    id: event.target.dataset.handId,
    origin: "hand",
    element: event.target,
  });
  event.dataTransfer.effectAllowed = "move";
}

export function handleDragStartBoardLetter(event) {
  if (!state.gameActive) {
    event.preventDefault();
    return;
  }
  const slotElement = event.target.closest(".board-slot.has-letter");
  if (!slotElement) return;

  const boardIndex = parseInt(slotElement.dataset.index);
  const letterOnBoard = state.boardState[boardIndex];
  if (!letterOnBoard) return;

  slotElement.classList.add("dragging");
  setDraggedLetterInfo({
    ...letterOnBoard,
    origin: "board",
    boardIndex: boardIndex,
    element: slotElement,
  });
  event.dataTransfer.effectAllowed = "move";
}

export function handleDragEndLetter(event) {
  const draggedInfo = state.draggedLetterInfo;
  if (draggedInfo && draggedInfo.element)
    draggedInfo.element.classList.remove("dragging");
  setDraggedLetterInfo(null);
  document
    .querySelectorAll(".drag-over")
    .forEach((el) => el.classList.remove("drag-over"));
}

export function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

export function handleDragEnter(event) {
  event.preventDefault();
  const target = event.target.closest(".board-slot, #player-hand");
  const draggedInfo = state.draggedLetterInfo;
  if (target) {
    if (
      draggedInfo &&
      draggedInfo.origin === "board" &&
      target.classList.contains("board-slot") &&
      parseInt(target.dataset.index) === draggedInfo.boardIndex
    )
      return;
    target.classList.add("drag-over");
  }
}

export function handleDragLeave(event) {
  const target = event.target.closest(".board-slot, #player-hand");
  if (target) target.classList.remove("drag-over");
}

export function handleDropOnBoardSlot(event) {
  event.preventDefault();
  const draggedInfo = state.draggedLetterInfo;
  if (!state.gameActive || !draggedInfo) return;

  const targetSlotElement = event.target.closest(".board-slot");
  if (!targetSlotElement) return;
  targetSlotElement.classList.remove("drag-over");
  const targetSlotIndex = parseInt(targetSlotElement.dataset.index);

  const newBoard = [...state.boardState];
  let newHand = [...state.playerHand];
  const existingLetterInTarget = newBoard[targetSlotIndex];

  if (draggedInfo.origin === "hand") {
    if (!existingLetterInTarget) {
      newBoard[targetSlotIndex] = {
        letter: draggedInfo.letter,
        id: draggedInfo.id,
      };
      newHand = newHand.filter((tile) => tile.id !== draggedInfo.id);
    } else {
      const letterToHand = newBoard[targetSlotIndex];
      newBoard[targetSlotIndex] = {
        letter: draggedInfo.letter,
        id: draggedInfo.id,
      };
      newHand = newHand.filter((tile) => tile.id !== draggedInfo.id);
      newHand.push(letterToHand);
    }
  } else if (draggedInfo.origin === "board") {
    if (draggedInfo.boardIndex === targetSlotIndex) return;
    newBoard[targetSlotIndex] = newBoard[draggedInfo.boardIndex];
    newBoard[draggedInfo.boardIndex] = existingLetterInTarget || null;
  }

  setBoardState(newBoard);
  setPlayerHand(newHand);
  ui.renderBoard();
  ui.renderHand();
  calculateAndUpdateWordScore();
  setDraggedLetterInfo(null);
}

export function handleDropOnPlayerHand(event) {
  event.preventDefault();
  const draggedInfo = state.draggedLetterInfo;
  if (!state.gameActive || !draggedInfo || draggedInfo.origin !== "board")
    return;

  ui.playerHandElement.classList.remove("drag-over");

  const newBoard = [...state.boardState];
  const newHand = [...state.playerHand];
  const letterData = newBoard[draggedInfo.boardIndex];
  if (letterData) {
    newHand.push(letterData);
    newBoard[draggedInfo.boardIndex] = null;
    setBoardState(newBoard);
    setPlayerHand(newHand);
    ui.renderBoard();
    sortHandAlpha();
  }
  setDraggedLetterInfo(null);
}
