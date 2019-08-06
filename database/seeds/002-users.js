const faker = require('faker');

exports.seed = function seedUsers(knex) {
  return knex('users')
    .del()
    .then(() =>
      knex('users').insert([
        {
          // id: 1,
          username: 'admin',
          email: 'teamstampd@gmail.com',
          profilePicture: '',
          sub: '1',
          roleId: 1
        },
        {
          // id: 2,
          username: 'admin2',
          email: 'stampdteam@gmail.com',
          profilePicture: '',
          sub: '2',
          roleId: 1
        },
        // These are the school accounts
        {
          // id: 3,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          sub: '3',
          roleId: 2
        },
        {
          // id: 4,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          sub: '4',
          roleId: 2
        },
        {
          // id: 5,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          sub: '5',
          roleId: 2
        },
        // These are the student accounts
        {
          // id: 6,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          sub: '6',
          roleId: 3
        },
        {
          // id: 7,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          sub: '7',
          roleId: 3
        },
        {
          // id: 8,
          username: faker.fake('{{internet.userName}}'),
          email: faker.fake('{{internet.email}}'),
          profilePicture: '',
          sub: '8',
          roleId: 3
        }
      ])
    );
};
