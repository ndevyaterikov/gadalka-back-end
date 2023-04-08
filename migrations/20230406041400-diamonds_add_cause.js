'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
          return Promise.all([
            queryInterface.addColumn('diamonds', 'cause', {
              type: Sequelize.DataTypes.STRING, unique: false
            }, { transaction: t }),
          ]);
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
