exports.seed = function seedsStudentDetails(knex) {
  // Deletes ALL existing entries
  return knex('studentDetails')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('studentDetails').insert([
        {
          name: 'Clint Kunz',
          street1: 'Midway St.',
          street2: null,
          city: 'Utahy',
          state: 'UT',
          zip: '5050',
          phone: '555-5555',
          userId: 6
        },
        {
          name: 'Brannan Conrad',
          street1: 'Chicago',
          street2: null,
          city: 'Savoy',
          state: 'IL',
          zip: '61874',
          phone: '555-5555',
          userId: 7
        },
        {
          name: 'Aljoe Bacus',
          street1: 'NM',
          street2: null,
          city: 'avg joe',
          state: 'NM',
          zip: '61874',
          phone: '555-5555',
          userId: 8
        }
      ]);
    });
};
