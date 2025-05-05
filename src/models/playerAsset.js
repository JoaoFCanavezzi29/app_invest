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
      },
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'   
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Assets',
        key: 'id'
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE'  
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