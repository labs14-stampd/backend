exports.seed = async knex => {
  await knex('studentDetails').insert([
    {
      fullName: 'Clint Kunz',
      firstName: 'Clint',
      middleName: 'Z',
      lastName: 'Kunz',
      street1: 'Midway St.',
      street2: null,
      city: 'Utahy',
      state: 'UT',
      zip: '5050',
      phone: '555-5555',
      userId: 6
    },
    {
      fullName: 'Brannan Conrad',
      firstName: 'Brannan',
      middleName: 'G',
      lastName: 'Conrad',
      street1: 'Chicago',
      street2: null,
      city: 'Savoy',
      state: 'IL',
      zip: '61874',
      phone: '555-5555',
      userId: 7
    },
    {
      fullName: 'Joe Bacus',
      firstName: 'Joe',
      middleName: 'M',
      lastName: 'Bacus',
      street1: 'NM',
      street2: null,
      city: 'avg joe',
      state: 'NM',
      zip: '61874',
      phone: '555-5555',
      userId: 8
    }
  ]);
};
