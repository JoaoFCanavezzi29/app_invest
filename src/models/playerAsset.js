const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlayerAsset = (sequelize, DataTypes) => {
  const PlayerAssetModel = sequelize.define('PlayerAsset', {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id'
      }
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Assets',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.INTEGER
    },
    purchase_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return PlayerAssetModel;
};

module.exports = PlayerAsset;
