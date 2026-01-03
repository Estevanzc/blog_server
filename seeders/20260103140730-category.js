'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Programming',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Web Development',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Artificial Intelligence',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Art',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Culture',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Politics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Business',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Finance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mental Health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Entertainment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Games',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Travel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'DIY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Food',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lifestyle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Opinion',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
