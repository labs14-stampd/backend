exports.seed = function seedSchoolDetails(knex) {
  return knex('schoolDetails')
    .del()
    .then(() =>
      knex('schoolDetails').insert([
        {
          // id: 1,
          name: 'School of the Midweast',
          taxId: '000000000',
          street1: 'Midway St.',
          street2: null,
          city: 'Midway City',
          state: 'MA',
          zip: '5050',
          phone: '555-5555',
          type: 'University',
          url: 'https://www.midweast.edu/',
          userId: 3
        },
        {
          // id: 2,
          name: 'School of the Weast',
          taxId: '000000001',
          street1: 'Grove Street',
          street2: null,
          city: 'San Andreas',
          state: 'CA',
          zip: '0420',
          phone: '2-610-2004',
          type: 'University',
          url: 'https://www.bestestweastern.edu/',
          userId: 4
        },
        {
          // id: 3,
          name: 'School of the East',
          taxId: '000000002',
          street1: 'Sweet streats',
          street2: null,
          city: 'Sweet City',
          state: 'HA',
          zip: '00000',
          phone: '999-9999',
          type: 'College',
          url: 'https://www.weastern.edu/',
          userId: 5
        }
      ])
    );
};
