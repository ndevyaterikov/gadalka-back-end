'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'accountPicNumber', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),

      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'accountPicNumber', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),

      ]);
    });
  }
};
