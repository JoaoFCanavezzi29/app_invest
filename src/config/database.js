const Sequelize = require('sequelize');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

// Flag para controlar se precisamos reiniciar
let shouldRestart = false;

// Cria uma conexão temporária sem especificar o banco de dados
const adminSequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

// Função assíncrona auto-executável para verificar/criar o banco de dados
(async () => {
  try {
    const [results] = await adminSequelize.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );

    if (results.length === 0) {
      console.log(`Database ${process.env.DB_NAME} não encontrado. Criando...`);
      await adminSequelize.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database ${process.env.DB_NAME} criado com sucesso. Reinicie o servidor...`);
      shouldRestart = true;
    }
  } catch (error) {
    console.error('Erro ao verificar/criar database:', error);
  } finally {
    await adminSequelize.close();
    
    if (shouldRestart) {
      // Adiciona um pequeno delay para garantir que todas as mensagens sejam exibidas
      setTimeout(() => {
        process.exit(1); // Código de saída não-zero para indicar reinicialização
      }, 1000);
    }
  }
})();

// Cria e exporta a conexão principal com o banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;