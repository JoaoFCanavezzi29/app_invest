const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = (sequelize, DataTypes) => {
  const AssetModel = sequelize.define('Asset', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    },
    liquidity: {
      type: DataTypes.INTEGER
    },
    base_sale_time: {
      type: DataTypes.INTEGER
    },
    slippage: {
      type: DataTypes.DECIMAL(5, 2)
    },
    current_value: {
      type: DataTypes.DECIMAL(15, 2)
    }
  });

  return AssetModel;
};

module.exports = Asset;
