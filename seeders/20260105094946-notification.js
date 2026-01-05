'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notifications', [
      {
        name: "Notification1",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Notification2",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Notification3",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  }
};
