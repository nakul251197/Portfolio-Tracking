'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('portfolio', {
      id: {
        field: 'ID',
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      tickerSymbol: {
        field: 'TICKER_SYMBOL',
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      quantity: {
        field: 'QUANTITY',
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      avgPrice: {
        field: 'AVG_PRICE',
        type: Sequelize.DOUBLE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('portfolio');
  }
};
