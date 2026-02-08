const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Adiciona o payload do usuário (ex: { id: '...' }) ao objeto da requisição
        next(); // Passa para a próxima função (a rota em si)
    } catch (err) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};
