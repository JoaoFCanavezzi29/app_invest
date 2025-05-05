const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token não fornecido ou mal formatado' });

  const [, token] = authHeader.split(' ');

  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({ error: 'Chave secreta não configurada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Agora o objeto req.user contém { userId, email }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
