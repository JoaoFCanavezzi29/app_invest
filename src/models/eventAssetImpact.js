const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definindo o modelo Event
const EventAssetImpact = (sequelize, DataTypes) => {
    const Model = sequelize.define('EventAssetImpact', {
      impact: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: -0.99,
          max: 0.99
        }
      }
    });
  
    Model.associate = models => {
      Model.belongsTo(models.Event, { foreignKey: 'event_id' });
      Model.belongsTo(models.Asset, { foreignKey: 'asset_id', as: 'asset' }); // <<< Aqui definimos o alias corretamente
    };
  
    return Model;
  };
  
  module.exports = EventAssetImpact;