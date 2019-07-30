const faker = require('faker');

exports.seed = function(knex, Promise) {
  return knex('schoolDetails')
    .truncate()
    .then(function() {
      return knex('schoolDetails').insert([
        {
          name: 'School of the Midwest',
          taxId: '000000000',
          street1: faker.fake('{{address.streetName}}'),
          street2: null,
          city: faker.fake('{{address.city}}'),
          state: faker.fake('{{address.state}}'),
          zip: faker.fake('{{address.zipCode}}'),
          phone: faker.fake('{{phone.phoneNumber}}'),
          type: 'University',
          url: 'https://www.southern.edu/',
          userId: 3
        },
        {
          name: 'School of the West',
          taxId: '000000000',
          street1: faker.fake('{{address.streetName}}'),
          street2: null,
          city: faker.fake('{{address.city}}'),
          state: faker.fake('{{address.state}}'),
          zip: faker.fake('{{address.zipCode}}'),
          phone: faker.fake('{{phone.phoneNumber}}'),
          type: 'University',
          url: 'https://www.southern.edu/',
          userId: 4
        },
        {
          name: 'School of the East',
          taxId: '000000000',
          street1: faker.fake('{{address.streetName}}'),
          street2: null,
          city: faker.fake('{{address.city}}'),
          state: faker.fake('{{address.state}}'),
          zip: faker.fake('{{address.zipCode}}'),
          phone: faker.fake('{{phone.phoneNumber}}'),
          type: 'College',
          url: 'https://www.southern.edu/',
          userId: 5
        }
      ]);
    });
};
