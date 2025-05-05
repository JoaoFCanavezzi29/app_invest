// models/SaleQueue.js
module.exports = (sequelize, DataTypes) => {
    const SaleQueue = sequelize.define('SaleQueue', {
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rounds_remaining: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'sale_queue',
      timestamps: true
    });
  
    return SaleQueue;
  };
  