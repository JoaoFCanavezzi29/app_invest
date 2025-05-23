const express = require('express');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const roundRoutes = require('./routes/roundRoutes');
const eventRoutes = require('./routes/eventRoutes');
const assetRoutes = require('./routes/assetRoutes');
const playerRoutes = require('./routes/playerRoutes');
const db = require('./models');
const authMiddleware = require('./middlewares/authMiddleware');
const authenticateToken = require('./middlewares/authenticateToken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/events', authMiddleware, authenticateToken, eventRoutes);
app.use('/api/assets', authMiddleware, authenticateToken, assetRoutes);
app.use('/api/player', authMiddleware, authenticateToken, playerRoutes);

// Testa conexão com o banco antes de iniciar o servidor

if (process.env.NODE_ENV !== 'test') {
  db.sequelize.authenticate()
    .then(() => {
      console.log(`🟢 Conectado ao banco: ${db.sequelize.config.database}`);
      return db.sequelize.sync(); // opcional: sincroniza os modelos
    })
    .then(() => {
      app.listen(3000, () => {
        console.log('🚀 Servidor rodando na porta 3000');
      });
    })
    .catch((err) => {
      console.error('🔴 Erro ao conectar com o banco de dados:', err.message);
    });
}

module.exports = app;  // Exporte o app para os testes
