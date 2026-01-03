'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Post_tags', [
      {
        post_id: 1,
        tag_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        tag_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        tag_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Post_tags', null, {});
  }
};
