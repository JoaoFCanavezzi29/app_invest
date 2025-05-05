const request = require('supertest');
const app = require('../app');
const { User, Player, Event, Asset, EventAssetImpact } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  const payload = { userId: user.id, email: user.email };
  const secretKey = process.env.JWT_SECRET_KEY || 'secret_test_key';
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

let token;
let createdEventIds = [];
let createdAssetId;
let createdUserIds = [];
let createdPlayerIds = [];

beforeAll(async () => {
  let admin = await User.findOne({ where: { role: 'admin' } });
  if (!admin) {
    const username = 'EventAdmin';
    const email = 'eventadmin@example.com';
    const password_hash = await bcrypt.hash('adminpassword', 10);
    const player = await Player.create({ username });
    admin = await User.create({ username, email, password_hash, role: 'admin', player_id: player.id });
    createdPlayerIds.push(player.id);
    createdUserIds.push(admin.id);
  }

  token = generateToken(admin);

  const asset = await Asset.create({
    name: 'ImpactAsset',
    type: 'Stock',
    liquidity: 1000,
    base_sale_time: 1,
    slippage: 5,
    current_value: 100,
  });
  createdAssetId = asset.id;
});

describe('Rotas /api/events', () => {
  it('POST /api/events - Deve criar um novo evento', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Crise Econômica', description: 'Afeta todos os ativos negativamente.' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Crise Econômica');
    createdEventIds.push(res.body.id);
  });

  it('GET /api/events - Deve retornar todos os eventos', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/events/:id - Deve retornar um evento com seus impactos', async () => {
    const eventId = createdEventIds[0];
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(eventId);
  });

  it('PUT /api/events/:id - Deve atualizar o nome e descrição do evento', async () => {
    const eventId = createdEventIds[0];
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Crise Atualizada', description: 'Nova descrição.' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Crise Atualizada');
  });

  it('POST /api/events/:id/impact - Deve associar impacto do evento a um ativo', async () => {
    const eventId = createdEventIds[0];
    console.log('event', eventId);
    console.log('assetId', createdAssetId);
    const res = await request(app)
      .put(`/api/events/${eventId}/impact`)
      .set('Authorization', `Bearer ${token}`)
      .send({ assetId: createdAssetId, impact: -0.2 });

    expect(res.status).toBe(200);
    expect(res.body.event_id).toBe(eventId);
    expect(res.body.asset_id).toBe(createdAssetId);
  });

  it('DELETE /api/events/:id - Deve deletar o evento', async () => {
    const eventId = createdEventIds[0];
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});

afterAll(async () => {
  for (let eventId of createdEventIds) {
    const event = await Event.findByPk(eventId);
    if (event) await event.destroy();
  }

  if (createdAssetId) {
    const asset = await Asset.findByPk(createdAssetId);
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
