const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // Futuramente: username, password, etc.
  // Por agora, vamos focar nas palavras
  knownWords: [{ type: String }], // Lista de palavras que o usuário conhece
  unknownWords: [{ type: String }] // Lista de palavras que ele quer aprender
});

// O 'User' será o nome da coleção no MongoDB
module.exports = mongoose.model('User', UserSchema);
