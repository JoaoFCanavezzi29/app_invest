const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

/**
 * @swagger
 * tags:
 *   - name: Ativos
 *     description: Operações relacionadas a Ativos.
 */

/**
 * @swagger
 * /api/assets/player-assets:
 *   get:
 *     summary: Retorna todos os ativos de um jogador
 *     description: Recupera uma lista de ativos de um jogador com base no seu ID.
 *     tags:
 *       - Ativos
 *     responses:
 *       200:
 *         description: Lista de ativos do jogador.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   player_id:
 *                     type: integer
 *                     description: ID do jogador.
 *                   asset_id:
 *                     type: integer
 *                     description: ID do ativo.
 *                   amount:
 *                     type: integer
 *                     description: Quantidade do ativo do jogador.
 *       500:
 *         description: Erro ao buscar ativos do jogador.
 */
router.get('/player-assets', assetController.getAllPlayerAssets);

/**
 * @swagger
 * /api/assets/player-assets/purchase:
 *   post:
 *     summary: Compra um ativo para o jogador
 *     description: Registra a compra de um ativo para o jogador.
 *     tags:
 *       - Ativos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *                 description: ID do ativo a ser comprado.
 *               amount:
 *                 type: integer
 *                 description: Quantidade do ativo a ser comprada.
 *     responses:
 *       201:
 *         description: Compra realizada com sucesso.
 *       400:
 *         description: Erro na compra (por exemplo, saldo insuficiente ou limite de ações).
 *       500:
 *         description: Erro ao realizar compra.
 */
router.post('/player-assets/purchase', assetController.purchasePlayerAsset);

/**
 * @swagger
 * /api/assets/player-assets/sell:
 *   post:
 *     summary: Vende um ativo do jogador
 *     description: Registra a venda de um ativo do jogador.
 *     tags:
 *       - Ativos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *                 description: ID do ativo a ser vendido.
 *               amount:
 *                 type: integer
 *                 description: Quantidade do ativo a ser vendido.
 *     responses:
 *       200:
 *         description: Venda realizada com sucesso.
 *       400:
 *         description: Erro na venda (por exemplo, quantidade insuficiente de ativos).
 *       500:
 *         description: Erro ao realizar venda.
 */
router.post('/player-assets/sell', assetController.sellPlayerAsset);


/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Retorna todos os ativos
 *     description: Recupera uma lista de todos os ativos cadastrados no sistema.
 *     tags:
 *       - Ativos
 *     responses:
 *       200:
 *         description: Lista de ativos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do ativo.
 *                   name:
 *                     type: string
 *                     description: Nome do ativo.
 *                   type:
 *                     type: string
 *                     description: Tipo do ativo.
 *                   liquidity:
 *                     type: number
 *                     description: Liquidez do ativo.
 *                   current_value:
 *                     type: number
 *                     description: Valor atual do ativo.
 *                   slippage:
 *                     type: number
 *                     description: Percentual de variação do ativo.
 *                   base_sale_time:
 *                     type: integer
 *                     description: Tempo base de venda do ativo.
 *       500:
 *         description: Erro ao buscar ativos.
 */
router.get('/', assetController.getAllAssets);

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Registra um novo ativo
 *     description: Cria um novo ativo no sistema.
 *     tags:
 *       - Ativos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do ativo.
 *               type:
 *                 type: string
 *                 description: Tipo do ativo.
 *               liquidity:
 *                 type: number
 *                 description: Liquidez do ativo.
 *               base_sale_time:
 *                 type: integer
 *                 description: Tempo base de venda do ativo.
 *               slippage:
 *                 type: number
 *                 description: Percentual de variação do ativo.
 *               current_value:
 *                 type: number
 *                 description: Valor atual do ativo.
 *     responses:
 *       201:
 *         description: Ativo registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do ativo.
 *                 name:
 *                   type: string
 *                   description: Nome do ativo.
 *                 type:
 *                   type: string
 *                   description: Tipo do ativo.
 *                 liquidity:
 *                   type: number
 *                   description: Liquidez do ativo.
 *                 current_value:
 *                   type: number
 *                   description: Valor atual do ativo.
 *                 slippage:
 *                   type: number
 *                   description: Percentual de variação do ativo.
 *                 base_sale_time:
 *                   type: integer
 *                   description: Tempo base de venda do ativo.
 *       500:
 *         description: Erro ao registrar ativo.
 */
router.post('/', assetController.registerAsset);

/**
 * @swagger
 * /api/assets/{id}:
 *   get:
 *     summary: Retorna um ativo específico
 *     description: Recupera um ativo baseado no seu ID.
 *     tags:
 *       - Ativos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do ativo.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ativo encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do ativo.
 *                 name:
 *                   type: string
 *                   description: Nome do ativo.
 *                 type:
 *                   type: string
 *                   description: Tipo do ativo.
 *                 liquidity:
 *                   type: number
 *                   description: Liquidez do ativo.
 *                 current_value:
 *                   type: number
 *                   description: Valor atual do ativo.
 *                 slippage:
 *                   type: number
 *                   description: Percentual de variação do ativo.
 *                 base_sale_time:
 *                   type: integer
 *                   description: Tempo base de venda do ativo.
 *       404:
 *         description: Ativo não encontrado.
 *       500:
 *         description: Erro ao buscar ativo.
 */
router.get('/:id', assetController.getAssetById);

/**
 * @swagger
 * /api/assets/{id}:
 *   put:
 *     summary: Atualiza um ativo específico
 *     description: Atualiza as informações de um ativo baseado no seu ID.
 *     tags:
 *       - Ativos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do ativo.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do ativo.
 *               type:
 *                 type: string
 *                 description: Tipo do ativo.
 *               liquidity:
 *                 type: number
 *                 description: Liquidez do ativo.
 *               base_sale_time:
 *                 type: integer
 *                 description: Tempo base de venda do ativo.
 *               slippage:
 *                 type: number
 *                 description: Percentual de variação do ativo.
 *               current_value:
 *                 type: number
 *                 description: Valor atual do ativo.
 *     responses:
 *       200:
 *         description: Ativo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do ativo.
 *                 name:
 *                   type: string
 *                   description: Nome do ativo.
 *                 type:
 *                   type: string
 *                   description: Tipo do ativo.
 *                 liquidity:
 *                   type: number
 *                   description: Liquidez do ativo.
 *                 current_value:
 *                   type: number
 *                   description: Valor atual do ativo.
 *                 slippage:
 *                   type: number
 *                   description: Percentual de variação do ativo.
 *                 base_sale_time:
 *                   type: integer
 *                   description: Tempo base de venda do ativo.
 *       404:
 *         description: Ativo não encontrado.
 *       500:
 *         description: Erro ao atualizar ativo.
 */
router.put('/:id', assetController.updateAsset);

/**
 * @swagger
 * /api/assets/{id}:
 *   delete:
 *     summary: Apaga um ativo específico
 *     description: Apaga um ativo baseado no seu ID.
 *     tags:
 *       - Ativos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do ativo.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ativo apagado com sucesso.
 *       404:
 *         description: Ativo não encontrado.
 *       500:
 *         description: Erro ao apagar ativo.
 */
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
