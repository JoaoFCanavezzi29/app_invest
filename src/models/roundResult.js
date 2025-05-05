const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoundResult = (sequelize, DataTypes) => {
  const RoundResultModel = sequelize.define('RoundResult', {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.DECIMAL(15, 2)
    },
    round: {
      type: DataTypes.INTEGER
    },
    events_occurred: {
      type: DataTypes.TEXT
    },
    round_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return RoundResultModel;
};

module.exports = RoundResult;
