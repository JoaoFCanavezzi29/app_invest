const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

/**
 * @swagger
 * tags:
 *   name: Player
 *   description: API para manipulação de jogadores e usuários.
 */

/**
 * @swagger
 * /api/player:
 *   get:
 *     summary: Retorna todos os usuários e dados dos jogadores.
 *     tags: [Player]
 *     responses:
 *       200:
 *         description: Lista de jogadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', playerController.getAllUsers); 

/**
 * @swagger
 * /api/player/{id}:
 *   get:
 *     summary: Retorna um usuário e dados do jogador pelo ID.
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do jogador
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do jogador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', playerController.getUserById); 

/**
 * @swagger
 * /api/player/{id}:
 *   put:
 *     summary: Atualiza informações do jogador (role e value).
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do jogador
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               value:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuário e jogador atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requisição mal formada
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', playerController.updateUser); 

/**
 * @swagger
 * /api/player/{id}:
 *   delete:
 *     summary: Deleta um usuário e o jogador associado.
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do jogador
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário e jogador deletados com sucesso
 *       403:
 *         description: Acesso negado (apenas para admins)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', playerController.deleteUser); 

/**
 * @swagger
 * /api/player/{id}/password:
 *   patch:
 *     summary: Altera a senha do usuário.
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do jogador
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nova senha do usuário
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha não fornecida
 *       403:
 *         description: Acesso negado (apenas para o próprio usuário ou admin)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id/password', playerController.changePassword); 

module.exports = router;
