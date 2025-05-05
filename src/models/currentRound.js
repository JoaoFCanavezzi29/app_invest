// models/CurrentRound.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CurrentRound = sequelize.define('CurrentRound', {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Garantir que cada jogador tenha apenas uma rodada ativa por vez
    },
    round_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    round_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'current_rounds', // Nome da tabela no banco de dados
    timestamps: false,            // Não precisamos de timestamps para este modelo específico
  });

  return CurrentRound;
};
