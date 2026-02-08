const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const TOTAL_WORD_LIST = require('../config/wordlist');

// Rota para obter o progresso de um usuário
router.get('/:userId/progress', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            // Se o usuário não existir, podemos criar um novo aqui
            const newUser = new User({ _id: req.params.userId, knownWords: [], unknownWords: [] });
            await newUser.save();
            return res.json({ knownWords: [], unknownWords: [] });
        }
        res.json({
            knownWords: user.knownWords,
            unknownWords: user.unknownWords
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar progresso do usuário.' });
    }
});

// Rota para adicionar uma palavra conhecida
router.post('/:userId/known', async (req, res) => {
    const { word } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

        user.knownWords.addToSet(word); // .addToSet garante que não haja duplicatas
        user.unknownWords.pull(word); // Remove da outra lista, se existir
        await user.save();
        res.status(200).json({ message: 'Progresso salvo.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar palavra conhecida.' });
    }
});

// Rota para adicionar uma palavra desconhecida
router.post('/:userId/unknown', async (req, res) => {
    const { word } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

        // Só adiciona se não for conhecida
        if (!user.knownWords.includes(word)) {
            user.unknownWords.addToSet(word);
        }
        await user.save();
        res.status(200).json({ message: 'Progresso salvo.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar palavra desconhecida.' });
    }
});

// GET /:userId/stats
router.get('/:userId/stats', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            // Se o ID for inválido, não adianta nem tentar buscar.
            return res.status(400).json({ error: 'Formato de ID de usuário inválido.' });
        }

        const user = await User.findById(req.params.userId);

        // Se o usuário não for encontrado no banco de dados...
        if (!user) {
            // Retornamos um objeto de estatísticas zerado.
            // Isso é um comportamento esperado e não um erro.
            return res.status(200).json({
                known: 0,
                unknown: 0,
                total: TOTAL_WORD_LIST.length
            });
        }

        // Se o usuário FOI encontrado, calculamos as estatísticas a partir dele.
        const knownCount = user ? user.knownWords.length : 0;
        const unknownCount = user ? user.unknownWords.length : 0;

        res.status(200).json({
            known: knownCount,
            unknown: unknownCount,
            total: TOTAL_WORD_LIST.length
        });
    } catch (error) {
        // Se chegarmos aqui, é um erro inesperado (ex: falha de conexão com o DB).
        console.error('ERRO INESPERADO AO BUSCAR ESTATÍSTICAS:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas.' })
    }
});

module.exports = router;
