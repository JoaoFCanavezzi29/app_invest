const { User, Player } = require('../models');
const bcrypt = require('bcryptjs');

// Listar todos os usuários e seus dados de player
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Player, as: 'player' },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Buscar usuário e jogador por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: { model: Player, as: 'player' },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

// Atualizar usuário e/ou jogador
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, value } = req.body;

  try {
    const user = await User.findByPk(id, {
      include: { model: Player, as: 'player' },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Atualiza campos de User
    user.role = role || user.role;

    // Atualiza dados do Player associado
    if (user.player) {
      user.player.value = value ?? user.player.value;
      await user.player.save();
    }

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário e jogador.' });
  }
};

// Deletar usuário e jogador
exports.deleteUser = async (req, res) => {

  const userID = req.user.userId;
  let userObject = await User.findByPk(userID);
  
  if (userObject.role != 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
  }
  
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const player = await Player.findByPk(user.player_id);
    if (player) {
      await player.destroy();
    }

    await user.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar usuário e jogador.' });
  }
};

// Função para alterar apenas a senha do usuário
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const userID = req.user.userId;
  let userObject = await User.findByPk(userID);
  if (userObject.role != 'admin') {
    if (userObject.id != id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
  }

  if (!password) {
    return res.status(400).json({ error: 'A nova senha é obrigatória.' });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Apenas atualiza o hash da senha
    user.password_hash = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao alterar senha do usuário.' });
  }
};
  