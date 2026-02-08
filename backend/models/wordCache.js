const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordCacheSchema = new Schema({
  word: { type: String, required: true, unique: true, index: true }, // A palavra em inglês
  details: { // O JSON com os detalhes que a IA retornou
    translation: String,
    examples: [{ en: String, pt: String }],
    definitions: [{ context: String, meaning: String }]
  },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Opcional: faz o cache expirar em 30 dias
});

module.exports = mongoose.model('WordCache', WordCacheSchema);
