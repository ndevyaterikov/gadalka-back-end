'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'userName', {
          type: Sequelize.DataTypes.STRING, unique
        }, { transaction: t }),

      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'userName', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),

      ]);
    });
  }
};
