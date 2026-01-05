'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Member_requests', [
      {
        user_id: 4,
        blog_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        blog_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 4,
        blog_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Member_requests', null, {});
  }
};
