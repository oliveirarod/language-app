const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const WordCache = require('../models/wordCache'); // Importa nosso modelo de cache
const User = require('../models/user');
const mongoose = require('mongoose');

// A lista total de palavras do nosso app
const TOTAL_WORD_LIST = require('../config/wordlist');

// Inicializa o cliente da OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/words/info
router.post('/info', async (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).json({ error: 'A palavra é obrigatória.' });
    }

    try {
        // 1. O backend consulta no banco se a palavra já foi pesquisada
        const cachedWord = await WordCache.findOne({ word: word.toLowerCase() });

        // 2. Se já houver informação, retorna o que está salvo no banco
        if (cachedWord) {
            console.log(`Palavra "${word}" encontrada no cache.`);
            return res.json(cachedWord.details);
        }

        // 3. Caso contrário, faz a requisição para a IA (OpenAI)
        console.log(`Palavra "${word}" não encontrada no cache. Consultando a OpenAI...`);
        const prompt = `Para a palavra em inglês "${word}", forneça um JSON com: "translation" (tradução para pt-BR), "examples" (array de 3 objetos com "en" e "pt"), e "definitions" (array de objetos com "context" e "meaning"). Responda apenas com o objeto JSON, sem nenhum texto, comentários ou formatação extra.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Modelo econômico
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }, // Pede para a IA garantir que a saída seja JSON!
        });

        const aiResponseText = completion.choices[0].message.content;
        const wordDetails = JSON.parse(aiResponseText);

        // 4. Salva a nova resposta no banco de dados para futuras requisições
        const newCachedWord = new WordCache({
            word: word.toLowerCase(),
            details: wordDetails
        });
        await newCachedWord.save();
        console.log(`Palavra "${word}" salva no cache.`);

        // 5. Retorna a resposta da IA para o frontend
        res.json(wordDetails);

    } catch (error) {
        console.error('Erro no processo de busca da palavra:', error);
        res.status(500).json({ error: 'Falha ao processar a solicitação da palavra.' });
    }
});

// GET /api/words/next/:userId
router.get('/next/:userId', async (req, res) => {
    try {
        // Valida se o ID do usuário é um ObjectId válido do Mongo
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ error: 'ID de usuário inválido.' });
        }

        let user = await User.findById(req.params.userId);

        // Se o usuário não existe, cria um novo
        if (!user) {
            user = new User({ _id: req.params.userId, knownWords: [], unknownWords: [] });
            await user.save();
            console.log('Novo usuário criado com sucesso!');
        }

        const seenWords = [...user.knownWords, ...user.unknownWords];
        const availableWords = TOTAL_WORD_LIST.filter(word => !seenWords.includes(word));

        if (availableWords.length === 0) {
            return res.json({ word: null, message: "Parabéns! Você viu todas as palavras." });
        }

        const nextWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        res.json({ word: nextWord });

    } catch (error) {
        console.error("Erro ao buscar próxima palavra:", error);
        res.status(500).json({ error: 'Erro ao buscar próxima palavra.' });
    }
});

module.exports = router;
