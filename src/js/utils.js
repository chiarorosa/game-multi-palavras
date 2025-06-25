/**
 * Embaralha um array no lugar usando o algoritmo Fisher-Yates.
 * @param {Array} array O array a ser embaralhado.
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Gera um ID único simples baseado no tempo e em um número aleatório.
 * @returns {string} Um ID único.
 */
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
