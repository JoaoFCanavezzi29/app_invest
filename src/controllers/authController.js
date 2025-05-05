const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Player } = require('../models');
require('dotenv').config();

const generateToken = (user) => {
    const payload = {
      userId: user.id,
      email: user.email
    };
    
    // A chave secreta agora vem da variável de ambiente
    const secretKey = process.env.JWT_SECRET_KEY;
  
    if (!secretKey) {
      throw new Error('Chave secreta não definida.');
    }
  
    const options = {
      expiresIn: '1h'
    };
  
    return jwt.sign(payload, secretKey, options);
  };

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const player = await Player.create({ username }); // cria player
    const user = await User.create({
      username,
      email,
      password_hash: hash,
      player_id: player.id
    });

    res.status(201).json({ message: 'Usuário criado', user: user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário', error });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
  
      const token = generateToken(user);
      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro ao fazer login',
        message: error.message,  // Retorna a mensagem do erro
        stack: error.stack       // Retorna o stack trace, útil para debugar
      });
    }
  };
  