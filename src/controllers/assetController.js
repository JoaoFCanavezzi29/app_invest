const { PlayerAsset, Asset, Player, SaleQueue, Round, CurrentRound, User } = require('../models');

// Função de variação baseada em liquidez e quantidade
function calcularVariacao(asset, quantidade, tipo) {
    const impactoBase = quantidade / asset.liquidity;
    let variacao = impactoBase * 0.1;

    if (tipo === 'venda') variacao *= -1;

    return Number((asset.current_value * variacao).toFixed(2));
}

// Função para verificar o limite de ações de compra e venda por rodada
async function verificarLimiteDeAcoes(playerId) {
    let currentRound = await CurrentRound.findOne({ where: { player_id: playerId } });

    if (!currentRound) {
        currentRound = await CurrentRound.create({
            player_id: playerId,
            round_id: 1,
            round_number: 1,
        });
    }

    const roundId = currentRound.round_id;

    let roundActions = await Round.findOne({ where: { player_id: playerId, round_id: roundId } });

    if (!roundActions) {
        roundActions = await Round.create({
            player_id: playerId,
            round_id: roundId,
            purchases: 0,
            sales: 0,
        });
    }

    return roundActions;
}

exports.registerAsset = async (req, res) => {
    let { name, type, liqudity, base_sale_time, slippage, current_value } = req.body;

    liqudity = Number(Number(liqudity).toFixed(2));
    slippage = Number(Number(slippage).toFixed(2));
    current_value = Number(Number(current_value).toFixed(2));

    try {
        const asset = await Asset.create({ name, type, liqudity, base_sale_time, slippage, current_value });
        return res.status(201).json(asset);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao registrar ativo.' });
    }
};

exports.getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.findAll();
        return res.status(200).json(assets);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar ativos.' });
    }
};

exports.getAssetById = async (req, res) => {
    const { id } = req.params;
    try {
        const asset = await Asset.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Ativo não encontrado.' });
        }
        return res.status(200).json(asset);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar ativo.' });
    }
};

exports.deleteAsset = async (req, res) => {

    const userID = req.user.userId;
    let userObject = await User.findByPk(userID);

    if (userObject.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    
    const { id } = req.params;
    try {
        const asset = await Asset.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Ativo não encontrado.' });
        }
        await asset.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao apagar ativo.' });
    }
};

exports.updateAsset = async (req, res) => {
    const userID = req.user.userId;
    let userObject = await User.findByPk(userID);

    if (userObject.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { id } = req.params;
    let { name, type, liqudity, base_sale_time, slippage, current_value } = req.body;
    try {
        const asset = await Asset.findByPk(id);
        if (!asset) {
            return res.status(404).json({ error: 'Ativo não encontrado.' });
        }

        asset.name = name || asset.name;
        asset.type = type || asset.type;
        asset.liqudity = liqudity ? Number(Number(liqudity).toFixed(2)) : asset.liqudity;
        asset.base_sale_time = base_sale_time || asset.base_sale_time;
        asset.slippage = slippage ? Number(Number(slippage).toFixed(2)) : asset.slippage;
        asset.current_value = current_value ? Number(Number(current_value).toFixed(2)) : asset.current_value;

        await asset.save();
        return res.status(200).json(asset);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao editar ativo.' });
    }
};

exports.getAllPlayerAssets = async (req, res) => {
    const userID = req.user.userId;
    try {
        const playerAssets = await PlayerAsset.findAll({ where: { player_id: userID } });
        return res.status(200).json(playerAssets);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar ativos do jogador.' });
    }
};

exports.purchasePlayerAsset = async (req, res) => {
    try {
        // Verificação de segurança inicial
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const userID = req.user.userId;
        const { asset_id, amount } = req.body;

        if (!asset_id || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Dados de compra inválidos.' });
        }

        const userObject = await User.findByPk(userID);
        if (!userObject) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const player = await Player.findByPk(userObject.player_id);
        if (!player) {
            return res.status(404).json({ error: 'Jogador não encontrado.' });
        }

        const asset = await Asset.findByPk(asset_id);
        if (!asset) {
            return res.status(404).json({ error: 'Ativo não encontrado.' });
        }

        const roundActions = await verificarLimiteDeAcoes(userID);
        if (!roundActions || typeof roundActions.purchases !== 'number') {
            return res.status(500).json({ error: 'Erro ao verificar ações da rodada.' });
        }

        if (roundActions.purchases >= 2) {
            return res.status(400).json({ error: 'Limite de compras atingido para esta rodada.' });
        }

        let pricePerUnit = Number(asset.current_value);
        let variacaoAplicada = 0;

        if (Math.random() > 0.8) {
            const slip = Number(asset.slippage);
            if (isNaN(slip)) {
                return res.status(500).json({ error: 'Slippage inválido no ativo.' });
            }

            const variacao = pricePerUnit * (slip / 100);
            const direcao = Math.random() < 0.5 ? -1 : 1;
            variacaoAplicada = Number((direcao * variacao).toFixed(2));
            pricePerUnit = Number((pricePerUnit + variacaoAplicada).toFixed(2));
        }

        if (isNaN(pricePerUnit)) {
            return res.status(500).json({ error: 'Valor final do ativo inválido.' });
        }

        const totalPrice = Number((pricePerUnit * amount).toFixed(2));
        if (isNaN(totalPrice)) {
            return res.status(500).json({ error: 'Erro no cálculo do preço total.' });
        }

        if (player.value < totalPrice) {
            return res.status(400).json({ error: 'Saldo insuficiente para comprar este ativo.' });
        }

        player.value = Number((player.value - totalPrice).toFixed(2));
        await player.save();

        let playerAsset = await PlayerAsset.findOne({
            where: { player_id: player.id, asset_id: asset_id }
        });

        if (playerAsset) {
            playerAsset.amount += amount;
            await playerAsset.save();
        } else {
            playerAsset = await PlayerAsset.create({
                player_id: player.id,
                asset_id: asset_id,
                amount: amount
            });
        }

        const variacaoDeCompra = calcularVariacao(asset, amount, 'compra');
        if (isNaN(variacaoDeCompra)) {
            return res.status(500).json({ error: 'Erro na variação do ativo.' });
        }

        asset.current_value = Number((Number(asset.current_value) + Number(variacaoDeCompra)).toFixed(2));
        await asset.save();

        roundActions.purchases += 1;
        if (typeof roundActions.save !== 'function') {
            return res.status(500).json({ error: 'Erro ao salvar ações da rodada.' });
        }
        await roundActions.save();

        return res.status(201).json({
            message: 'Compra realizada com sucesso',
            valorFinalPorUnidade: pricePerUnit,
            variacaoAplicada,
            variacaoDeCompra,
            novoValorAtivo: asset.current_value,
            playerAsset
        });

    } catch (error) {
        console.error('Erro interno em purchasePlayerAsset:', error);
        return res.status(500).json({ error: 'Erro ao comprar ativo do jogador.' });
    }
};

exports.sellPlayerAsset = async (req, res) => {
    const userID = req.user.userId;
    const { asset_id, amount } = req.body;

    try {
        const user = await User.findByPk(userID);
        const player = await Player.findByPk(user.player_id);
        const asset = await Asset.findByPk(asset_id);

        if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });
        if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });

        const roundActions = await verificarLimiteDeAcoes(userID);
        if (roundActions.sales >= 2) {
            return res.status(400).json({ error: 'Limite de vendas atingido para esta rodada.' });
        }

        const playerAsset = await PlayerAsset.findOne({
            where: { player_id: user.player_id, asset_id: asset_id }
        });

        if (!playerAsset || playerAsset.amount < amount) {
            console.log('playerAsset', playerAsset)
            return res.status(400).json({ error: 'Quantidade insuficiente do ativo para vender' });
        }

        let unitValue = Number(asset.current_value);
        let variacaoAplicada = 0;

        if (Math.random() > 0.8) {
            const slip = Number(asset.slippage);
            const variacao = unitValue * (slip / 100);
            const direcao = Math.random() < 0.5 ? -1 : 1;

            variacaoAplicada = Number((direcao * variacao).toFixed(2));
            unitValue = Number((unitValue + variacaoAplicada).toFixed(2));
        }

        const totalSaleValue = Number((unitValue * amount).toFixed(2));
        const baseSaleTime = Number(asset.base_sale_time || 1);
        const randomOffset = Math.floor(Math.random() * 3) - 1;

        let roundsRemaining = baseSaleTime + randomOffset;

        if (amount >= 50) {
            roundsRemaining += Math.floor(amount / 10);
        }

        roundsRemaining = Math.max(1, roundsRemaining);

        await SaleQueue.create({
            player_id: userID,
            asset_id,
            amount,
            rounds_remaining: roundsRemaining,
            total_value: totalSaleValue
        });

        playerAsset.amount -= amount;

        if (playerAsset.amount === 0) {
            await playerAsset.destroy();
        } else {
            await playerAsset.save();
        }

        const variacaoDeVenda = calcularVariacao(asset, amount, 'venda');
        asset.current_value = Number((Number(asset.current_value) + Number(variacaoDeVenda)).toFixed(2));
        await asset.save();

        roundActions.sales += 1;
        await roundActions.save();

        return res.status(200).json({
            message: 'Venda registrada na fila',
            valorFinalPorUnidade: unitValue,
            variacaoAplicada,
            variacaoDeVenda,
            novoValorAtivo: asset.current_value,
            roundsRemaining,
            totalSaleValue,
            remainingAmount: playerAsset.amount
        });

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao registrar venda na fila.' });
    }
};
