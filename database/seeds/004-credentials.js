const faker = require('faker');
const moment = require('moment');

exports.seed = function(knex, Promise) {
  return knex('credentials')
    .del()
    .then(function() {
      return knex('credentials').insert([
        {
          id: 1,
          name: 'Masters in Gravitational Engineering',
          description:
            'Certifies that this person is capable of engineering while in a gravitational field',
          txHash: '',
          type: 'Masters',
          studentEmail: faker.fake('{{internet.email}}'),
          imageUrl: '',
          criteria: 'Complete Engineering of a gavitational field',
          issuedOn: moment('2016-01-01', 'YYYY-MM-DD'),
          schoolId: 4 //This is actually the id from 'users' table
        },
        {
          id: 2,
          name: 'B.A. in Classical Horsemanship',
          description:
            'Certifies that this person is capable of handling horses in a classical fashion',
          txHash: '',
          type: "Bachelor's",
          studentEmail: faker.fake('{{internet.email}}'),
          imageUrl: '',
          criteria: 'Complete Horsemanship at the Classical Level',
          issuedOn: moment('2016-01-01', 'YYYY-MM-DD'),
          schoolId: 5 //This is actually the id from 'users' table
        },
        {
          id: 3,
          name: 'PhD in Underwater Blow Torching',
          description:
            'Certifies that this person is capable of handling a blow torch underwater',
          txHash: '',
          type: 'PhD',
          studentEmail: faker.fake('{{internet.email}}'),
          imageUrl: '',
          criteria:
            'Complete Underwater Blowtorching at an Advanced Proficiency',
          issuedOn: moment('2016-01-01', 'YYYY-MM-DD'),
          schoolId: 4 //This is actually the id from 'users' table
        }
      ]);
    });
};
