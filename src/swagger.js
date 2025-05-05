const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API Exemplo',
      version: '1.0.0',
      description: 'Documentação da API usando Swagger',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'jogador1' },
            email: { type: 'string', example: 'email@dominio.com' },
            password_hash: { type: 'string', example: '$2b$10$...' },
            role: { type: 'string', example: 'player' },
            player: { $ref: '#/components/schemas/Player' }
          }
        },
        Player: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            value: { type: 'integer', example: 800000 }
          }
        },
        Asset: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Cristal Raro' },
            type: { type: 'string', example: 'gema' },
            liquidity: { type: 'integer', example: 15000 },
            base_sale_time: { type: 'integer', example: 3 },
            slippage: { type: 'number', format: 'float', example: 0.25 },
            current_value: { type: 'number', format: 'float', example: 125000.00 }
          }
        },
        PlayerAsset: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            player_id: { type: 'integer', example: 1 },
            asset_id: { type: 'integer', example: 3 },
            amount: { type: 'integer', example: 500 },
            purchase_date: { type: 'string', format: 'date-time', example: '2025-05-04T14:30:00Z' },
            asset: { $ref: '#/components/schemas/Asset' },
            player: { $ref: '#/components/schemas/Player' }
          }
        },
        Round: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            player_id: { type: 'integer', example: 1 },
            round_id: { type: 'integer', example: 12 },
            purchases: { type: 'integer', example: 1 },
            sales: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        RoundResult: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            player_id: { type: 'integer', example: 1 },
            value: { type: 'number', format: 'float', example: 985400.75 },
            round: { type: 'integer', example: 10 },
            events_occurred: {
              type: 'string',
              example: 'Mercado de Gema oscilou 7%, Player recebeu bônus de missão'
            },
            round_date: {
              type: 'string',
              format: 'date-time',
              example: '2025-05-04T18:00:00Z'
            }
          }
        },
        CurrentRound: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              player_id: { type: 'integer', example: 1 },
              round_id: { type: 'integer', example: 101 },
              round_number: { type: 'integer', example: 7 }
            }
        },
        Event: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              title: { type: 'string', example: 'Crise energética global' },
              description: { type: 'string', example: 'A produção de energia mundial foi severamente afetada.' },
              start_date: { type: 'string', format: 'date-time', example: '2025-05-04T00:00:00Z' },
              end_date: { type: 'string', format: 'date-time', example: '2025-05-10T00:00:00Z' }
            }
          },
          EventAssetImpact: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              event_id: { type: 'integer', example: 1 },
              asset_id: { type: 'integer', example: 2 },
              impact: { type: 'number', format: 'float', example: -0.25 }
            }
          },
          SaleQueue: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              player_id: { type: 'integer', example: 1 },
              asset_id: { type: 'integer', example: 2 },
              amount: { type: 'integer', example: 5 },
              rounds_remaining: { type: 'integer', example: 3 },
              createdAt: { type: 'string', format: 'date-time', example: '2025-05-04T00:00:00Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2025-05-04T01:00:00Z' }
            }
          }
                 
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [path.join(__dirname, './routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
