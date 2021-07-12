'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('trades', {
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
        allowNull: false
      },
      action: {
        field: 'ACTION',
        type: Sequelize.ENUM('BUY', 'SELL'),
        allowNull: false
      },
      quantity: {
        field: 'QUANTITY',
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      price: {
        field: 'PRICE',
        type: Sequelize.DOUBLE
      },
      createdOn: {
        field: 'CREATED_ON',
        type: Sequelize.DATE
      },
      updatedOn: {
        field: 'UPDATED_ON',
        type: Sequelize.DATE
      },
      deletedOn: {
        field: 'DELETED_ON',
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('trades'); 
  }
};
