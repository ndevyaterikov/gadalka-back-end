'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('messages', 'authorPicId', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),
        queryInterface.addColumn('messages', 'authorName', {
          type: Sequelize.DataTypes.INTEGER
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
