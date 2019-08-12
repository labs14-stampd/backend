exports.seed = function seedCredentials(knex) {
  return knex('credentials')
    .del()
    .then(() =>
      knex('credentials').insert([
        {
          // id: 1,
          credName: 'Masters in Gravitational Engineering',
          description:
            'Certifies that this person is capable of engineering while in a gravitational field',
          credHash: '',
          txHash: '',
          type: 'Masters',
          ownerName: 'Franklin Hall',
          studentEmail: 'graviton@gmail.com',
          imageUrl: '',
          valid: true,
          criteria: 'Completed Engineering of a gavitational field',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 1 // This is actually the id from 'users' table
        },
        {
          // id: 2,
          credName: 'B.A. in Classical Horsemanship',
          description:
            'Certifies that this person is capable of handling horses in a classical fashion',
          credHash: '',
          txHash: '',
          type: "Bachelor's",
          ownerName: 'Batchman',
          studentEmail: 'batchman@baidu.com',
          imageUrl: '',
          valid: false,
          criteria: 'Completed Horsemanship at the Classical Level',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 1 // This is actually the id from 'users' table
        },
        {
          // id: 3,
          credName: 'PhD in Underwater Blow Torching',
          description:
            'Certifies that this person is capable of handling a blow torch underwater',
          credHash: '',
          txHash: '',
          type: 'PhD',
          ownerName: 'Water Boi',
          studentEmail: 'aquaman@rocketmail.com',
          imageUrl: '',
          valid: true,
          criteria:
            'Completed Underwater Blowtorching at an Advanced Proficiency',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 4 // This is actually the id from 'users' table
        },
        {
          // id: ,
          credName: 'B.A. in Philosophy',
          description:
            "Certifies that this person achieved all requirements for a bachelor's in philosophy",
          credHash: '',
          txHash: '',
          type: "Bachelor's",
          ownerName: 'Franklin Hall',
          studentEmail: 'graviton@gmail.com',
          imageUrl: '',
          valid: true,
          criteria: "Completed bachelor's in philosophy",
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 1 // This is actually the id from 'users' table
        },
        {
          // id: 5,
          credName: 'B.A. in Classical Horsemanship',
          description:
            'Certifies that this person is capable of handling horses in a classical fashion',
          credHash: '',
          txHash: '',
          type: "Bachelor's",
          ownerName: 'Batchman',
          studentEmail: 'batchman@baidu.com',
          imageUrl: '',
          valid: false,
          criteria: 'Completed Horsemanship at the Classical Level',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 1 // This is actually the id from 'users' table
        },
        {
          // id: 6,
          credName: 'B.A. in Classical Horsemanship',
          description:
            'Certifies that this person is capable of handling horses in a classical fashion',
          credHash: '',
          txHash: '',
          type: "Bachelor's",
          ownerName: 'Batchman',
          studentEmail: 'batchman@baidu.com',
          imageUrl: '',
          valid: false,
          criteria: 'Completed Horsemanship at the Classical Level',
          issuedOn: '2016-01-01T06:00:00.000Z',
          expirationDate: '2029-01-01T06:00:00.000Z',
          schoolId: 1 // This is actually the id from 'users' table
        }
      ])
    );
};
