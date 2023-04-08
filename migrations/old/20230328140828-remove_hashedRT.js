'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'hashedRT', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),

      ]);
    });
  },

  async down (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'hashedRT', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),

      ]);
    });

  }
};
