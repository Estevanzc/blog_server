'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tags', [
      {
        name: 'javascript',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'react',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'nodejs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'sequelize',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'mysql',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ai',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'machine-learning',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'chatgpt',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'design',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ui-ux',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'business',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'startup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'marketing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'mental-health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'games',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'anime',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'travel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'nature',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'tutorials',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'food',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'recipes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'opinion',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'review',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};
