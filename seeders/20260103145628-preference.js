'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Preferences', [
      {
        keyword: "innovation",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        keyword: "analysis",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        keyword: "future",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        keyword: "impact",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        keyword: "research",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Preferences', null, {});
  }
};
