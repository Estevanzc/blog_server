'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Post_contents', [
      {
        post_id: 1,
        type: 1,
        content: 'The Internet Is Getting Louder, Not Smarter',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 2,
        content: 'Every year, it feels harder to find thoughtful conversations online. Social networks reward speed, outrage, and certainty, leaving little room for doubt or nuance. Opinions travel faster than reflections.',
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 2,
        content: 'This isn’t a problem of intelligence, but of incentives. When platforms measure success in clicks and reactions, depth becomes inefficient. Silence and hesitation — essential parts of thinking — simply do not perform well.',
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 3,
        content: 'https://images.example.com/noise-vs-thought.jpg',
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 2,
        content: 'Blogs and independent writing spaces still matter because they slow us down. They invite readers to stay, not scroll. A journal-like post does not need to win an argument; it needs to express one honestly.',
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 4,
        content: 'The enemy of thought is not ignorance, but the illusion of understanding._(Estevan Zimermann)_',
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 2,
        content: 'Writing, in this sense, becomes a personal act of resistance. Not against technology itself, but against the pressure to compress every idea into something instantly digestible.',
        order: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        post_id: 1,
        type: 2,
        content: 'If the internet is getting louder, maybe our responsibility as writers is not to shout back — but to speak more carefully, even if fewer people are listening.',
        order: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Post_contents', null, {});
  }
};
