const faker = require('faker');

exports.seed = function(knex, Promise) {
  return knex('users')
    .del()
    .then(function() {
      return knex('users').insert([
        {
          // id: 1,
          username: 'admin',
          email: 'teamstampd@gmail.com',
          profilePicture: '',
          roleId: 1
        },
        {
          // id: 2,
          username: 'admin2',
          email: 'stampdteam@gmail.com',
          profilePicture: '',
          roleId: 1
        },
        // These are the school accounts
        {
          // id: 3,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          roleId: 2
        },
        {
          // id: 4,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          roleId: 2
        },
        {
          // id: 5,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          roleId: 2
        },
        // These are the student accounts
        {
          // id: 6,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          roleId: 3
        },
        {
          // id: 7,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          roleId: 3
        },
        {
          // id: 8,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          roleId: 3
        }
      ]);
    });
};
