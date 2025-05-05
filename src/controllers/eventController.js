const { Event, Asset, EventAssetImpact, User } = require('../models');  // Importa os modelos necessários

// Função para criar um novo evento
exports.createEvent = async (req, res) => {
  try {
    const userID = req.user.userId;

    const userObject = await User.findByPk(userID);
    if (!userObject) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (userObject.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { name, description } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Nome do evento inválido.' });
    }

    const event = await Event.create({ name, description });
    return res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return res.status(500).json({ error: 'Erro interno ao criar evento.' });
  }
};


// Função para listar todos os eventos
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar eventos.' });
  }
};

// Função para visualizar um evento específico
exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id, {
      include: {
        model: Asset,
        through: { attributes: ['impact'] },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar evento.' });
  }
};

// Função para editar um evento
exports.updateEvent = async (req, res) => {

  const userID = req.user.userId;
    let userObject = await User.findByPk(userID);

    if (userObject.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }

  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    event.name = name || event.name;
    event.description = description || event.description;

    await event.save();

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao editar evento.' });
  }
};

// Função para apagar um evento
exports.deleteEvent = async (req, res) => {

  const userID = req.user.userId;
    let userObject = await User.findByPk(userID);

    if (userObject.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }

  const { id } = req.params;

  try {
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    await event.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao apagar evento.' });
  }
};

// Função para definir o impacto do evento nos ativos
exports.setEventImpact = async (req, res) => {
  try {
    const userID = req.user?.userId;
    console.log('User ID:', userID);

    if (!userID) {
      console.log('Erro: Usuário não autenticado');
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const userObject = await User.findByPk(userID);
    console.log('Usuário:', userObject?.toJSON?.() || 'Não encontrado');

    if (!userObject) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (userObject.role !== 'admin') {
      console.log('Erro: Acesso negado. Role do usuário:', userObject.role);
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { id } = req.params;
    const { assetId, impact } = req.body;
    
    if (!id || !assetId || typeof impact !== 'number') {
      return res.status(400).json({ error: 'Dados incompletos ou inválidos.' });
    }

    const event = await Event.findByPk(id);
    console.log('Evento:', event?.toJSON?.() || 'Não encontrado');

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.', debug: { id } });
    }

    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).json({ error: 'Ativo não encontrado.', debug: { assetId } });
    }

    const [eventAssetImpact, created] = await EventAssetImpact.upsert({
      event_id: event.id,
      asset_id: asset.id,
      impact,
    });

    return res.status(200).json(eventAssetImpact);

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao definir impacto do evento.', debug: error.message });
  }
};
