'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Blogs', [
      {
        name: 'Tech Insights',
        subname: 'Technology & Innovation',
        description: 'A blog focused on technology, programming, and innovation.',
        category_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science Daily',
        subname: 'Discover the universe',
        description: 'Posts about science, research, and discoveries.',
        category_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Art & Culture',
        subname: 'Creativity and Society',
        description: 'Exploring art, culture, and creative movements.',
        category_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Blogs', null, {});
  }
};
