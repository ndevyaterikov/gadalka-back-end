'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('diamonds', 'id', {
          type: Sequelize.DataTypes.INTEGER, unique: true
        }, { transaction: t }),
        queryInterface.addColumn('diamonds', 'transaction_count', {
          type: Sequelize.DataTypes.INTEGER, unique: false
        }, { transaction: t }),
        queryInterface.addColumn('diamonds', 'diamond_count', {
          type: Sequelize.DataTypes.INTEGER, unique: false
        }, { transaction: t }),
        queryInterface.addColumn('diamonds', 'userId', {
          type: Sequelize.DataTypes.INTEGER, references: {model:{tableName:'users'}}
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
