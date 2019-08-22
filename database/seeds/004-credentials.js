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
          criteria: 'Complete Engineering of a gavitational field',
          issuedOn: '08/08/2016',
          expirationDate: '09/09/2040',
          schoolId: 3 // This is actually the id from 'users' table
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
          criteria: 'Complete Horsemanship at the Classical Level',
          issuedOn: '08/09/2011',
          expirationDate: '09/09/2040',
          schoolId: 3 // This is actually the id from 'users' table
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
            'Complete Underwater Blowtorching at an Advanced Proficiency',
          issuedOn: '02/02/2017',
          expirationDate: '09/09/2040',
          schoolId: 3 // This is actually the id from 'users' table
        },
        {
          // id: 4,
          credName: 'Bachelor in Gravitational Engineering',
          description:
            'Certifies that this person is capable of engineering while in a gravitational field',
          credHash: '',
          txHash: '',
          type: 'Masters',
          ownerName: 'Billonar Plebui',
          studentEmail: 'eligiblebachelor@hey.net',
          imageUrl: '',
          valid: true,
          criteria: 'Complete Engineering of a gavitational field',
          issuedOn: '08/08/2016',
          expirationDate: '09/09/2040',
          schoolId: 5 // This is actually the id from 'users' table
        },
        {
          // id: 5,
          credName: 'Doctorate in Classical Horsemanship',
          description:
            'Certifies that this person is capable of handling horses in a classical fashion',
          credHash: '',
          txHash: '',
          type: "Bachelor's",
          ownerName: 'Hao Dee',
          studentEmail: 'howdy@neighquestr.com',
          imageUrl: '',
          valid: false,
          criteria: 'Complete Horsemanship at the Classical Level',
          issuedOn: '08/09/2011',
          expirationDate: '09/09/2040',
          schoolId: 4 // This is actually the id from 'users' table
        },
        {
          // id: 6,
          credName: "Associate's Degree in Underwater Blow Torching",
          description:
            'Certifies that this person is capable of handling a blow torch underwater',
          credHash: '',
          txHash: '',
          type: 'PhD',
          ownerName: 'Hao Dee',
          studentEmail: 'howdy@neighquestr.com',
          imageUrl: '',
          valid: true,
          criteria:
            'Complete Underwater Blowtorching at an Advanced Proficiency',
          issuedOn: '02/02/2017',
          expirationDate: '09/09/2040',
          schoolId: 4 // This is actually the id from 'users' table
        }
      ])
    );
};
