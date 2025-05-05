const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Endpoints de gerenciamento de eventos
 */

/**
 * @swagger
 * /api/events/{id}/impact:
 *   put:
 *     summary: Define ou atualiza o impacto do evento sobre um ativo
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - impact
 *             properties:
 *               assetId:
 *                 type: integer
 *               impact:
 *                 type: number
 *                 format: float
 *                 minimum: -0.99
 *                 maximum: 0.99
 *     responses:
 *       200:
 *         description: Impacto definido com sucesso
 *       404:
 *         description: Evento ou ativo não encontrado
 *       500:
 *         description: Erro ao definir impacto
 */
router.put('/:id/impact', eventController.setEventImpact);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       500:
 *         description: Erro ao criar evento
 */
router.post('/', eventController.createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *       500:
 *         description: Erro ao buscar eventos
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Busca um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro ao buscar evento
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro ao editar evento
 */
router.put('/:id', eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       204:
 *         description: Evento removido com sucesso
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro ao apagar evento
 */
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
