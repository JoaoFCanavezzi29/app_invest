const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Importação dos modelos
const Player = require('./player')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Asset = require('./asset')(sequelize, Sequelize.DataTypes);
const PlayerAsset = require('./playerAsset')(sequelize, Sequelize.DataTypes);
const RoundResult = require('./roundResult')(sequelize, Sequelize.DataTypes);
const Event = require('./event')(sequelize, Sequelize.DataTypes);
const EventAssetImpact = require('./eventAssetImpact')(sequelize, Sequelize.DataTypes); // Importado corretamente
const SaleQueue = require('./sale')(sequelize, Sequelize.DataTypes);
const Round = require('./round')(sequelize, Sequelize.DataTypes);
const CurrentRound = require('./currentRound')(sequelize, Sequelize.DataTypes);

// Registro no objeto db
const db = {
  sequelize,
  Sequelize,
  Player,
  User,
  Asset,
  PlayerAsset,
  RoundResult,
  Event,
  EventAssetImpact,
  SaleQueue,
  Round,
  CurrentRound
};

// Associação entre os modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sincronizar os modelos com o banco de dados
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Banco de dados e tabelas criados (caso não existam).');
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });

module.exports = db;
