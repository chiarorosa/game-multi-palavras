// main.js
// Ponto de entrada do jogo. Conecta os eventos da UI com a lógica do jogo.

import {
  initializeGame,
  mixWord,
  swapLetters,
  clearWordFromBoard,
  sortHandAlpha,
  handleDragStartHandLetter,
  handleDragEndLetter,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDropOnPlayerHand,
} from "./gameLogic.js";

import {
  playButton,
  swapLettersButton,
  clearWordButton,
  sortAlphaButton,
  restartButton,
  menuButton,
  playerHandElement,
  showMessage,
} from "./ui.js";

// Função para adicionar os event listeners nas letras da mão,
// precisa ser chamada sempre que a mão é renderizada.
function addDragListenersToHand() {
  const handTiles = playerHandElement.querySelectorAll(".letter-tile");
  handTiles.forEach((tile) => {
    tile.addEventListener("dragstart", handleDragStartHandLetter);
    tile.addEventListener("dragend", handleDragEndLetter);
  });
}

// Adiciona um "observador" para detectar quando a mão é redesenhada
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      addDragListenersToHand();
    }
  }
});
// Inicia a observação no elemento da mão do jogador
observer.observe(playerHandElement, { childList: true });

// --- Event Listeners dos Botões ---
playButton.addEventListener("click", mixWord);
swapLettersButton.addEventListener("click", swapLetters);
clearWordButton.addEventListener("click", clearWordFromBoard);
sortAlphaButton.addEventListener("click", sortHandAlpha);
restartButton.addEventListener("click", initializeGame);
menuButton.addEventListener("click", () =>
  showMessage("Menu não implementado.", 1500)
);

// --- Event Listeners para a área de drop da mão ---
playerHandElement.addEventListener("dragover", handleDragOver);
playerHandElement.addEventListener("dragenter", handleDragEnter);
playerHandElement.addEventListener("dragleave", handleDragLeave);
playerHandElement.addEventListener("drop", handleDropOnPlayerHand);

// Inicia o jogo quando o script é carregado
initializeGame();
