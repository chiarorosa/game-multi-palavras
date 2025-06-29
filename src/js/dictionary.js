// src/js/dictionary.js
// Responsável por importar todas as categorias de palavras e construir o dicionário final.

import { NUM_BOARD_SLOTS } from "./config.js";

// Importa todas as listas de palavras
import ANIMAIS from "./dictionaries/animais.js";
import COMIDA_E_BEBIDA from "./dictionaries/comidas.js";
import PROFISSOES from "./dictionaries/profissoes.js";
import NATUREZA_E_GEOGRAFIA from "./dictionaries/natureza.js";
import CONCEITOS_E_ADJETIVOS from "./dictionaries/conceitos.js";
import VERBOS from "./dictionaries/verbos.js";
import OBJETOS_E_LUGARES from "./dictionaries/objetos.js";
import ESPORTES from "./dictionaries/esportes.js";
import TECNOLOGIA from "./dictionaries/tecnologia.js";

// Combina todas as categorias em um único dicionário, removendo duplicatas e acentos.
// O filtro final garante que nenhuma palavra maior que o tabuleiro seja incluída.
export const DICTIONARY = [
  ...new Set([
    ...ANIMAIS,
    ...COMIDA_E_BEBIDA,
    ...PROFISSOES,
    ...NATUREZA_E_GEOGRAFIA,
    ...CONCEITOS_E_ADJETIVOS,
    ...VERBOS,
    ...OBJETOS_E_LUGARES,
    ...ESPORTES,
    ...TECNOLOGIA,
  ]),
]
  .map((palavra) =>
    palavra
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  )
  .filter((palavra, index, self) => self.indexOf(palavra) === index) // Remove duplicatas após normalização
  .filter((palavra) => palavra.length <= NUM_BOARD_SLOTS);

// Imprime a contagem final no console para verificação.
console.log(
  `Dicionário carregado com ${DICTIONARY.length} palavras únicas e normalizadas.`
);
