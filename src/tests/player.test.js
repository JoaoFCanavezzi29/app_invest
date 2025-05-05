const request = require('supertest');
const app = require('../app');
const { User, Player } = require('../models');
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
let createdUserId;
let createdPlayerId;
let createdUserIds = [];
let createdPlayerIds = [];

beforeAll(async () => {
  // Cria admin se não existir
  let admin = await User.findOne({ where: { role: 'admin' } });
  if (!admin) {
    admin = await User.create({
      username: 'TestAdmin',
      email: 'admin@example.com',
      password_hash: await bcrypt.hash('adminpassword', 10),
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

  createdUserId = res.body.user.id;
  createdPlayerId = res.body.user.player_id;

  createdUserIds.push(createdUserId);
  createdPlayerIds.push(createdPlayerId);
});

describe('Rotas /api/player', () => {
  it('GET /api/player - Deve retornar todos os usuários', async () => {
    const res = await request(app)
      .get('/api/player')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/player/:id - Deve atualizar role e value do usuário', async () => {
    const resPlayer = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'TempPlayer2',
        email: 'tempplayer@example.com',
        password: 'tempplayerpassword'
      });

    const { user } = resPlayer.body;
    createdUserIds.push(user.id);
    createdPlayerIds.push(user.player_id);

    const updatedRes = await request(app)
      .put(`/api/player/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin', value: 1000 });

    expect(updatedRes.statusCode).toBe(200);
    expect(updatedRes.body.role).toBe('admin');
    expect(updatedRes.body.player.value).toBe(1000);
  });

  it('GET /api/player/:id - Deve retornar um usuário pelo ID', async () => {
    const res = await request(app)
      .get(`/api/player/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdUserId);
  });

  it('PATCH /api/player/:id/password - Deve alterar a senha', async () => {
    const res = await request(app)
      .patch(`/api/player/${createdUserId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'novaSenha123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Senha alterada/);
  });

  it('DELETE /api/player/:id - Deve deletar o usuário', async () => {
    const res = await request(app)
      .delete(`/api/player/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  it('GET /api/player/:id - Deve retornar 404 após deletar', async () => {
    const res = await request(app)
      .get(`/api/player/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  try {
    // Deleta Players primeiro (por FK)
    await Player.destroy({
      where: { id: createdPlayerIds },
      force: true
    });

    // Depois deleta Users
    await User.destroy({
      where: { id: createdUserIds },
      force: true
    });
  } catch (err) {
    console.error('Erro ao limpar dados de teste:', err);
  }
});
