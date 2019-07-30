const faker = require('faker');

exports.seed = function(knex, Promise) {
  return knex('users')
    .truncate()
    .then(function() {
      return knex('users').insert([
        {
          username: 'admin',
          email: 'teamstampd@gmail.com',
          roleId: 1
        },
        {
          username: 'admin2',
          email: 'stampdteam@gmail.com',
          roleId: 1
        },
        // These are the school accounts
        {
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          roleId: 2
        },
        {
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          roleId: 2
        },
        {
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          roleId: 2
        },
        // These are the student accounts
        {
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          roleId: 3
        },
        {
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          roleId: 3
        },
        {
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          roleId: 3
        }
      ]);
    });
};
