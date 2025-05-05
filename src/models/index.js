const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

// Importação dos modelos
const Player = require('./player')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Asset = require('./asset')(sequelize, Sequelize.DataTypes);
const PlayerAsset = require('./playerAsset')(sequelize, Sequelize.DataTypes);
const RoundResult = require('./roundResult')(sequelize, Sequelize.DataTypes);
const Event = require('./event')(sequelize, Sequelize.DataTypes);
const EventAssetImpact = require('./eventAssetImpact')(sequelize, Sequelize.DataTypes);
const SaleQueue = require('./sale')(sequelize, Sequelize.DataTypes);
const Round = require('./round')(sequelize, Sequelize.DataTypes);
const CurrentRound = require('./currentRound')(sequelize, Sequelize.DataTypes);
const bcrypt = require('bcryptjs');

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

// Função para ler e executar scripts SQL
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    // Divide o script em comandos individuais (separados por ;)
    const commands = sql.split(';').filter(cmd => cmd.trim() !== '');
    
    for (const cmd of commands) {
      if (cmd.trim()) {
        await sequelize.query(cmd, { raw: true });
      }
    }
    return true;
  } catch (error) {
    console.error(`Erro ao executar script SQL ${filePath}:`, error);
    throw error;
  }
}

// Função para executar scripts de inicialização SQL
async function runSeedScripts() {
  const scriptsPath = path.join(__dirname, '../scripts');
  
  try {
    // Verifica se o diretório de scripts existe
    if (!fs.existsSync(scriptsPath)) {
      console.log('Diretório de scripts não encontrado. Pulando execução de scripts.');
      return;
    }

    // Lê os arquivos SQL do diretório de scripts
    const scriptFiles = fs.readdirSync(scriptsPath)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordena para garantir ordem de execução

    // Executa cada script sequencialmente
    for (const file of scriptFiles) {
      try {
        const scriptPath = path.join(scriptsPath, file);
        console.log(`Executando script SQL: ${file}`);
        await executeSqlFile(scriptPath);
        console.log(`Script SQL ${file} executado com sucesso.`);
      } catch (err) {
        console.error(`Erro ao executar script SQL ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('Erro ao ler diretório de scripts:', err);
  }
}

// Função para verificar se as tabelas estão vazias
async function checkAndSeedDatabase() {
  try {
    // Verifica se as tabelas principais estão vazias
    const [usersCount, assetsCount, eventsCount, playersCount] = await Promise.all([
      User.count(),
      Asset.count(),
      Event.count(),
      Player.count()
    ]);

    const shouldSeed = usersCount === 0 || assetsCount === 0 || eventsCount === 0 || playersCount === 0;

    if (shouldSeed) {
      console.log('Tabelas principais vazias detectadas. Executando scripts SQL de inicialização...');
      await runSeedScripts();
      try {
        let admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
          const username = 'admin';
          const email = 'admin@admin.com';
          const hash = await bcrypt.hash('adminpassword', 10);
      
          const player = await Player.create({ username });
          admin = await User.create({
            username,
            email,
            password_hash: hash,
            player_id: player.id,
            role: 'admin'
          });
          console.log('✅ Usuário admin criado com sucesso');
        }
      } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error);
      }
    } else {
      console.log('Tabelas já populadas. Pulando scripts de inicialização.');
    }
  } catch (err) {
    console.error('Erro ao verificar tabelas:', err);
  }
}

// Sincronizar os modelos com o banco de dados e depois verificar/executar scripts
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco de dados e tabelas sincronizados.');
    return checkAndSeedDatabase();
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });

module.exports = db;