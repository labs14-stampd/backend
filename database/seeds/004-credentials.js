const faker = require('faker');
const moment = require('moment');

exports.seed = function(knex, Promise) {
  return knex('credentials')
    .truncate()
    .then(function() {
      return knex('credentials').insert([
        {
          name: 'Masters in Gravitational Engineering',
          description: 'Certifies that this person is capable of engineering while in a gravitational field',
          txHash: "",
          type: "Masters",
          studentEmail: faker.fake('{{internet.email}}'),
          imageUrl: "",
          criteria: "Complete Engineering of a gavitational field",
          issuedOn: moment('2016-01-01', 'YYYY-MM-DD'),
          schoolId: 4 //This is actually the id from 'users' table
        },
      ]);
    });
};
