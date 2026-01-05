'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const password = await bcrypt.hash('admin', 10);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Estevan Zimermann',
        email: 'estevan.zimermann@gmail.com',
        password: password,
        birth: new Date('2008-02-26'),
        description: 'Demo user account',
        dark_mode: false,
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: password,
        birth: new Date('2000-05-20'),
        description: 'Demo user account',
        dark_mode: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: password,
        birth: new Date('1998-11-10'),
        description: 'Another demo user',
        dark_mode: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'John Doe\'s brother',
        email: 'johndoesbrother@example.com',
        password: password,
        birth: new Date('1998-11-10'),
        description: 'Another demo user',
        dark_mode: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
