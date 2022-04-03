const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('bulkorder', {
    status: {
      type: DataTypes.ENUM(
        'pending',
        'finished',
        'preparing',
        'onDelivery',
        'delivered',
        'cancelled'
      ),
      allowNull: false,
    },
    purchaseId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serverPurchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    localPurchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    serverDeliverDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    localDeliverDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    serverCancelDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    localCancelDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    combinedPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    combinedShippingCost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });
};