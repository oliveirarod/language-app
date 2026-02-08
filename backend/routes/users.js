const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const TOTAL_WORD_LIST = require('../config/wordlist');
const auth = require('../middleware/auth');

// GET /stats
router.get('/stats', auth, async (req, res) => {
    try {
        // 1. Pega o ID do usuário a partir do token JWT (garantido pelo middleware 'auth')
        const userId = req.user.id;

        // 2. Busca o usuário no banco de dados.
        const user = await User.findById(userId);

        // 3. Verificação de segurança: se o usuário do token não existe no DB (caso raro, ex: deletado)
        if (!user) {
            // Neste caso, é um erro de autorização, pois o token é para um usuário fantasma.
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // 4. Se o usuário foi encontrado, calcula e retorna as estatísticas.
        const knownCount = user.knownWords.length;
        const unknownCount = user.unknownWords.length;

        res.status(200).json({
            known: knownCount,
            unknown: unknownCount,
            total: TOTAL_WORD_LIST.length
        });

    } catch (error) {
        // Este bloco 'catch' agora lida com erros genuínos do servidor (ex: falha de conexão com o DB).
        console.error('ERRO INESPERADO AO BUSCAR ESTATÍSTICAS:', error);
        res.status(500).json({ error: 'Erro de servidor ao buscar estatísticas.' });
    }
});

// Rota para obter o progresso de um usuário
router.get('/progress', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({
            knownWords: user.knownWords,
            unknownWords: user.unknownWords
        });
    } catch (error) {
        console.error('ERRO AO BUSCAR PROGRESSO:', error);
        res.status(500).json({ error: 'Erro ao buscar progresso do usuário.' });
    }
});

// Rota para adicionar uma palavra conhecida
router.post('/known', auth, async (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).json({ error: 'A palavra é obrigatória.' });
    }

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        user.knownWords.addToSet(word.toLowerCase()); // Garante consistência salvando em minúsculas
        user.unknownWords.pull(word.toLowerCase());
        await user.save();

        res.status(200).json({ message: 'Progresso salvo.' });
    } catch (error) {
        console.error('ERRO AO SALVAR PALAVRA CONHECIDA:', error);
        res.status(500).json({ error: 'Erro ao salvar palavra conhecida.' });
    }
});

// Rota para adicionar uma palavra desconhecida
router.post('/unknown', auth, async (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).json({ error: 'A palavra é obrigatória.' });
    }

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const lowerCaseWord = word.toLowerCase();
        if (!user.knownWords.includes(lowerCaseWord)) {
            user.unknownWords.addToSet(lowerCaseWord);
        }
        await user.save();

        res.status(200).json({ message: 'Progresso salvo.' });
    } catch (error) {
        console.error('ERRO AO SALVAR PALAVRA DESCONHECIDA:', error);
        res.status(500).json({ error: 'Erro ao salvar palavra desconhecida.' });
    }
});

module.exports = router;
