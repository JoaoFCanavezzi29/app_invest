const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Função para definir o modelo Player
const Player = (sequelize, DataTypes) => {
  const PlayerModel = sequelize.define('Player', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 10000.00
    }
  });

  return PlayerModel;
};

module.exports = Player;
