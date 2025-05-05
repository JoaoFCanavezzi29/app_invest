const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./player')(sequelize, DataTypes);  // Importa o modelo Player corretamente

// Função para definir o modelo User
const User = (sequelize, DataTypes) => {
  const UserModel = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'player'
    }
  });

  // Relacionamento entre User e Player: um User pertence a um Player
  UserModel.belongsTo(Player, {
    foreignKey: 'player_id',
    as: 'player'
  });

  return UserModel;
};

module.exports = User;
