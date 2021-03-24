'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 因為 sn 欄位內容太長，INTEGER 類別放不下，改成 STRING
    return queryInterface.changeColumn('Orders', 'sn', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Orders', 'sn', Sequelize.INTEGER)
  }
};
