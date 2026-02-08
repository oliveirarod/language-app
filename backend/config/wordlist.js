const fs = require('fs');
const path = require('path');

/**
 * Lê a lista de palavras do arquivo .txt e a retorna como um array.
 * @returns {string[]} Um array com todas as palavras.
 */
function loadWordList() {
  try {
    // Constrói o caminho para o arquivo de forma segura, não importa de onde o script seja chamado
    const filePath = path.join(__dirname, 'oxford-3000.txt');

    // Lê o conteúdo do arquivo como uma única string
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Processa a string:
    const words = fileContent
      .split(/\r?\n/)
      .filter(word => word.trim() !== '')
      .map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase());
    
    console.log(`Carregadas ${words.length} palavras da lista da Oxford.`);
    return words;

  } catch (error) {
    console.error('ERRO CRÍTICO: Não foi possível carregar a lista de palavras.', error);
    // Se a lista não puder ser carregada, o app não pode funcionar.
    // Em um app de produção, poderíamos ter um fallback, mas aqui é melhor parar.
    process.exit(1);
  }
}

// Executa a função e exporta o resultado
const TOTAL_WORD_LIST = loadWordList();

module.exports = TOTAL_WORD_LIST;
