'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('messages', 'authorPicId', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),
        queryInterface.removeColumn('messages', 'authorName', {
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
