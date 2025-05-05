// models/event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Event.associate = models => {
    Event.belongsToMany(models.Asset, {
      through: models.EventAssetImpact,
      foreignKey: 'event_id',
      otherKey: 'asset_id'
    });
  };

  return Event;
};
