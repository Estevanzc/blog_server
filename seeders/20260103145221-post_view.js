'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Post_views', [
      {
        post_id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        user_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Post_views', null, {});
  }
};
