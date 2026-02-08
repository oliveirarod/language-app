const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  knownWords: [{ type: String }],
  unknownWords: [{ type: String }]
});

module.exports = mongoose.model('User', UserSchema);
