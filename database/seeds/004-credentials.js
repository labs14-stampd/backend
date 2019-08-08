exports.seed = function seedCredentials(knex) {
  return knex('credentials')
    .del()
    .then(() =>
      knex('credentials').insert([
        {
          // id: 1,
          name: 'Masters in Gravitational Engineering',
          description:
            'Certifies that this person is capable of engineering while in a gravitational field',
          txHash: '',
          type: 'Masters',
          studentEmail: 'graviton@gmail.com',
          imageUrl: '',
          valid: true,
          criteria: 'Complete Engineering of a gavitational field',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 4 // This is actually the id from 'users' table
        },
        {
          // id: 2,
          name: 'B.A. in Classical Horsemanship',
          description:
            'Certifies that this person is capable of handling horses in a classical fashion',
          txHash: '',
          type: "Bachelor's",
          studentEmail: 'batchman@baidu.com',
          imageUrl: '',
          valid: false,
          criteria: 'Complete Horsemanship at the Classical Level',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 5 // This is actually the id from 'users' table
        },
        {
          // id: 3,
          name: 'PhD in Underwater Blow Torching',
          description:
            'Certifies that this person is capable of handling a blow torch underwater',
          txHash: '',
          type: 'PhD',
          studentEmail: 'aquaman@rocketmail.com',
          imageUrl: '',
          valid: true,
          criteria: 'Complete Underwater Blowtorching at an Advanced Proficiency',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 4 // This is actually the id from 'users' table
        }
      ])
    );
};
