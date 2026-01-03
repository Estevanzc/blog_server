'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Followers', [
      {
        blog_id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        blog_id: 1,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        blog_id: 1,
        user_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Followers', null, {});
  }
};
