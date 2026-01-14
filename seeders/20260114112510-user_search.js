'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User_searches', [
      {
        name: "loremipsum1",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "loremipsum2",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "loremipsum3",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User_searches', null, {});
  }
};
