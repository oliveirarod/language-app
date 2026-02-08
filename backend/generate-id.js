const mongoose = require('mongoose');
const newId = new mongoose.Types.ObjectId();
console.log('Seu novo ID de usuário para desenvolvimento é:');
console.log(newId.toString());
