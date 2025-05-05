const request = require('supertest');
const app = require('../app');
const { User, Player, Asset, PlayerAsset } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função para gerar o token JWT
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email
  };
  const secretKey = process.env.JWT_SECRET_KEY || 'secret_test_key';
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

let token;
let createdUserIds = [];
let createdPlayerIds = [];
let createdAssetIds = [];

beforeAll(async () => {
  // Cria admin se não existir
  let admin = await User.findOne({ where: { role: 'admin' } });
  if (!admin) {
    const username = 'TestAdmin';
    const email = 'admin@example.com';
    const hash = await bcrypt.hash('adminpassword', 10);

    const player = await Player.create({ username });
    admin = await User.create({
      username,
      email,
      password_hash: hash,
      player_id: player.id,
      role: 'admin'
    });
  }

  token = generateToken(admin);

  // Criação de um usuário padrão
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'TestUser',
      email: 'testuser@example.com',
      password: 'userpassword'
    });

  const createdUserId = res.body.user.id;
  const createdPlayerId = res.body.user.player_id;

  createdUserIds.push(createdUserId);
  createdPlayerIds.push(createdPlayerId);

  // Criação de um ativo para os testes
  const assetRes = await request(app)
    .post('/api/assets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'TestAsset',
      type: 'Stock',
      liquidity: 1000,
      base_sale_time: 1,
      slippage: 5,
      current_value: 100
    });

  const createdAssetId = assetRes.body.id;
  createdAssetIds.push(createdAssetId);
});

describe('Rotas /api/assets', () => {
  it('GET /api/assets - Deve retornar todos os ativos', async () => {
    const res = await request(app)
      .get('/api/assets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/assets/{id} - Deve retornar o ativo pelo ID', async () => {
    const res = await request(app)
      .get(`/api/assets/${createdAssetIds[0]}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdAssetIds[0]);
  });

  it('GET /api/assets/{id} - Deve retornar 404 se o ativo não for encontrado', async () => {
    const res = await request(app)
      .get('/api/assets/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Ativo não encontrado.');
  });

  it('PUT /api/assets/{id} - Deve atualizar um ativo', async () => {
    const res = await request(app)
      .put(`/api/assets/${createdAssetIds[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'UpdatedTestAsset',
        current_value: 120
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('UpdatedTestAsset');
    expect(res.body.current_value).toBe(120);
  });

  it('POST /api/assets - Deve registrar um novo ativo', async () => {
    const res = await request(app)
      .post('/api/assets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'AnotherTestAsset',
        type: 'Bond',
        liquidity: 2000,
        base_sale_time: 2,
        slippage: 3,
        current_value: 150
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('AnotherTestAsset');
    createdAssetIds.push(res.body.id);
  });

  it('POST /api/assets/player-assets/purchase - Deve comprar um ativo para o jogador', async () => {
    const res = await request(app)
      .post('/api/assets/player-assets/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        asset_id: createdAssetIds[0],
        amount: 10
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Compra realizada com sucesso');
  });

  it('POST /api/assets/player-assets/sell - Deve vender um ativo do jogador', async () => {
    const res = await request(app)
      .post('/api/assets/player-assets/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        asset_id: createdAssetIds[0],
        amount: 5
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Venda registrada na fila');
  });

  it('GET /api/assets/player-assets - Deve retornar todos os ativos de um jogador', async () => {
    const res = await request(app)
      .get('/api/assets/player-assets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /api/assets/{id} - Deve deletar um ativo', async () => {
    const assetId = createdAssetIds.pop(); // remove o último e deleta
    const res = await request(app)
      .delete(`/api/assets/${assetId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/assets/${assetId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});

afterAll(async () => {
  for (let id of createdAssetIds) {
    const asset = await Asset.findByPk(id);
    if (asset) await asset.destroy();
  }

  for (let id of createdUserIds) {
    const user = await User.findByPk(id);
    if (user) await user.destroy();
  }

  for (let id of createdPlayerIds) {
    const player = await Player.findByPk(id);
    if (player) await player.destroy();
  }
});
