const { Player, Asset, Event, RoundResult, EventAssetImpact, SaleQueue, CurrentRound } = require('../models');
const sequelize = require('../config/database');

const intervalo = 180000;


async function processSaleQueue() {
  try {
    const sales = await SaleQueue.findAll();

    if (!sales) return;

    for (const sale of sales) {
      if (sale.rounds_remaining > 1) {
        sale.rounds_remaining -= 1;
        await sale.save();
      } else {
        const player = await Player.findByPk(sale.player_id);
        const asset = await Asset.findByPk(sale.asset_id);

        const total_value = Number(asset.current_value) * Number(sale.amount);
        if (player) {
          player.value = Number(player.value) + total_value;
          await player.save();
        }

        await sale.destroy();
      }
    }
  } catch (error) {

  }
}

const processRound = async () => {
  try {
    const willHaveEvent = Math.random() > 0.8;
    const players = await Player.findAll();

    let event = null;
    let impactedAssets = [];

    if (willHaveEvent) {

      event = await Event.findOne({ order: sequelize.random() });

      if (!event) throw new Error('Nenhum evento disponível');

      const eventAssetImpacts = await EventAssetImpact.findAll({
        where: { event_id: event.id },
        include: [
          {
            model: Asset,
            as: 'asset',
            attributes: ['id', 'current_value'],
          },
        ],
      });

      for (const eventAssetImpact of eventAssetImpacts) {
        const asset = eventAssetImpact.asset;
        const impact = parseFloat(eventAssetImpact.impact);
        const currentValue = parseFloat(asset.current_value);

        const newValue = currentValue * (1 + impact);
        asset.current_value = parseFloat(newValue.toFixed(2));
        await asset.save();

        impactedAssets.push({
          id: asset.id,
          newValue: asset.current_value,
          appliedImpact: impact,
          originalValue: currentValue,
        });
      }
    } else {
    }

    for (const player of players) {
      let currentRound = await CurrentRound.findOne({ where: { player_id: player.id } });

      if (!currentRound) {
        currentRound = await CurrentRound.create({
          player_id: player.id,
          round_id: 1,          // inicia com ID e número iguais
          round_number: 1,
        });
      }

      await RoundResult.create({
        player_id: player.id,
        balance: player.balance,
        round: currentRound.round_number,
        events_occurred: willHaveEvent ? event.description : null,
      });

      currentRound.round_id += 1;
      currentRound.round_number += 1;
      await currentRound.save();
    }

    await processSaleQueue();
  } catch (error) {

  }
};

if (process.env.NODE_ENV !== 'test') {
  setInterval(processRound, intervalo);
}