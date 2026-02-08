// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Garanta que está importado

const authRoutes = require('./routes/auth');
const wordRoutes = require('./routes/words');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONEXÃO COM O MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Falha ao conectar com o MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
