'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Posts', [
      {
        title: 'The Future of Technology',
        subtitle: 'How AI is changing the world',
        summary: 'An overview of how artificial intelligence is impacting modern society and industries.',
        member_id: 1,
        blog_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Science and Society',
        subtitle: 'Why science matters',
        summary: 'Understanding the importance of scientific research in daily life.',
        member_id: 2,
        blog_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Art in the Digital Age',
        subtitle: 'Creativity meets technology',
        summary: 'How digital tools are transforming the art world.',
        member_id: 1,
        blog_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
