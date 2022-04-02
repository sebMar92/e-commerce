const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('order', {
    status: {
      type: DataTypes.ENUM(
        'inWishList',
        'inCart',
        'pending',
        'finished',
        'preparing',
        'onDelivery',
        'delivered',
        'cancelled'
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliverDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};
