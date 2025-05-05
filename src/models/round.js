// models/Round.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Round = sequelize.define('Round', {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    round_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purchases: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    sales: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'rounds', // Nome da tabela no banco de dados
    timestamps: true     // Gerenciamento automático de createdAt e updatedAt
  });

  // Métodos para verificar se o jogador pode comprar ou vender
  Round.prototype.canPurchase = function() {
    return this.purchases < 3;  // Limite de 2 compras por rodada
  };

  Round.prototype.canSell = function() {
    return this.sales < 3;  // Limite de 2 vendas por rodada
  };

  return Round;
};
