const { graphql } = require('graphql');
const schema = require('../schema/schema');

const USER_DATA = [
  {
    id: '1',
    username: 'admin',
    email: 'teamstampd@gmail.com',
    profilePicture: '',
    roleId: '2',
    sub: '1'
  },
  {
    id: '2',
    username: 'admin2',
    email: 'stampdteam@gmail.com',
    profilePicture: '',
    roleId: '1',
    sub: '2'
  },
  {
    id: '3',
    username: 'school1',
    email: 'schoolzrus@rocketmail.com',
    profilePicture: '',
    roleId: '2',
    sub: '3'
  },
  {
    id: '4',
    username: 'school2',
    email: 'surzloohcs@hotmail.com',
    profilePicture: '',
    roleId: '2',
    sub: '4'
  },
  {
    id: '5',
    username: 'school3',
    email: 'school@school.edu',
    profilePicture: '',
    roleId: '2',
    sub: '5'
  },
  {
    id: '6',
    username: 'student1',
    email: 'stud1@yahoo.com',
    profilePicture: '',
    roleId: '3',
    sub: '6'
  },
  {
    id: '7',
    username: 'student2',
    email: 'stud2@icloud.com',
    profilePicture: '',
    roleId: '3',
    sub: '7'
  },
  {
    id: '8',
    username: 'student3',
    email: 'notadud@yandex.com',
    profilePicture: '',
    roleId: '3',
    sub: '8'
  }
];

const SCHOOLDETAILS_DATA = [
  {
    id: '1',
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
    userId: '3'
  },
  {
    id: '2',
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
    userId: '4'
  },
  {
    id: '3',
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
    userId: '5'
  }
];

const CREDENTIALS_DATA = [
  {
    id: '1',
    name: 'Masters in Gravitational Engineering',
    description:
      'Certifies that this person is capable of engineering while in a gravitational field',
    credHash: '',
    txHash: '',
    type: 'Masters',
    studentEmail: 'graviton@gmail.com',
    imageUrl: '',
    criteria: 'Complete Engineering of a gavitational field',
    valid: true,
    issuedOn: '2016-01-01T06:00:00.000Z',
    expirationDate: '2029-01-01T06:00:00.000Z',
    schoolId: '4'
  },
  {
    id: '2',
    name: 'B.A. in Classical Horsemanship',
    description:
      'Certifies that this person is capable of handling horses in a classical fashion',
    credHash: '',
    txHash: '',
    type: "Bachelor's",
    studentEmail: 'batchman@baidu.com',
    imageUrl: '',
    criteria: 'Complete Horsemanship at the Classical Level',
    valid: false,
    issuedOn: '2016-01-01T06:00:00.000Z',
    expirationDate: '2029-01-01T06:00:00.000Z',
    schoolId: '5'
  },
  {
    id: '3',
    name: 'PhD in Underwater Blow Torching',
    description:
      'Certifies that this person is capable of handling a blow torch underwater',
    credHash: '',
    txHash: '',
    type: 'PhD',
    studentEmail: 'aquaman@rocketmail.com',
    imageUrl: '',
    criteria: 'Complete Underwater Blowtorching at an Advanced Proficiency',
    valid: true,
    issuedOn: '2016-01-01T06:00:00.000Z',
    expirationDate: '2029-01-01T06:00:00.000Z',
    schoolId: '4'
  }
];

describe('getAllUsers query: ', () => {
  it('• should return all user data from test seeds', async () => {
    const QUERY = `
      query {
        getAllUsers {
          id
          username
          email
          profilePicture
          roleId
          sub
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getAllUsers).toEqual(USER_DATA);
  });

  it("• should have matching role ID's in both roleId and role properties", async () => {
    const QUERY = `
      query {
        getAllUsers {
          roleId
          role {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getAllUsers.forEach(user => {
      expect(user.roleId).toEqual(user.role.id);
    });
  });

  it('• should have null value for schoolDetails property if user is not a school', async () => {
    const QUERY = `
      query {
        getAllUsers {
          roleId
          role {
            id
          }
          schoolDetails {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getAllUsers.forEach(user => {
      if (user.roleId != '2' && user.role.id != '2') {
        // Role ID number for schools is 2
        expect(user.schoolDetails).toBeNull();
      }
    });
  });
});

describe('getUserById query: ', () => {
  // Will use randomized test input
  it("• should return the corresponding user's data", async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 8); // Get a random ID within the range of the seed data
    const QUERY = `
      query {
        getUserById (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          username
          email
          profilePicture
          roleId
          sub
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getUserById).toEqual(USER_DATA[TEST_ID_TO_GET - 1]); // Subtract the ID by 1 to get the corresponding array index
  });

  it("• should have matching role ID's in both roleId and role properties", async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 8); // Get a random ID within the range of the user seed ID's
    const QUERY = `
      query {
        getUserById (
          id: ${TEST_ID_TO_GET}
        ) {
          roleId
          role {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getUserById.roleId).toEqual(res.data.getUserById.role.id);
  });

  it('• should have null value for schoolDetails property if user is not a school', async () => {
    // Get a random ID within the range of the user seed ID's that does not belong to a school user
    const IDS_TO_EXCLUDE = [3, 4, 5];
    let randResult;
    do {
      randResult = Math.ceil(Math.random() * 8);
    } while (IDS_TO_EXCLUDE.includes(randResult));

    const TEST_ID_TO_GET = randResult;
    const QUERY = `
      query {
        getUserById (
          id: ${TEST_ID_TO_GET}
        ) {
          schoolDetails {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getUserById.schoolDetails).toBeNull();
  });
});

describe('getUserById error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please include a user ID and try again.';

    const QUERY = `
      query {
        getUserById {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getUserById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get a non-existent user', async () => {
    const EXPECTED_ERROR_MESSAGE = 'The user could not be found.';

    const NONEXISTENT_ID_TO_GET = 0;
    const QUERY = `
      query {
        getUserById (
          id: ${NONEXISTENT_ID_TO_GET}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getUserById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getAllSchoolDetails query: ', () => {
  it('• should return all school details data from test seeds', async () => {
    const QUERY = `
      query {
        getAllSchoolDetails {
          id
          name
          taxId
          street1
          street2
          city
          state
          zip
          type
          phone
          url
          userId
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getAllSchoolDetails).toEqual(SCHOOLDETAILS_DATA);
  });

  it("• should have matching user ID's in both userId and user properties", async () => {
    const QUERY = `
      query {
        getAllSchoolDetails {
          userId
          user {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getAllSchoolDetails.forEach(schoolDetails => {
      expect(schoolDetails.userId).toEqual(schoolDetails.user.id);
    });
  });
});

describe('getSchoolDetailsBySchoolId query: ', () => {
  // Will use randomized test input
  it('• should return the corresponding school details data', async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 3); // Get a random ID within the range of the seed data
    const QUERY = `
      query {
        getSchoolDetailsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          name
          taxId
          street1
          street2
          city
          state
          zip
          type
          phone
          url
          userId
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getSchoolDetailsBySchoolId).toEqual(
      SCHOOLDETAILS_DATA[TEST_ID_TO_GET - 1]
    ); // Subtract the ID by 1 to get the corresponding array index
  });

  it("• should have matching user ID's in both userId and user properties", async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 3); // Get a random ID within the range of the seed data
    const QUERY = `
      query {
        getSchoolDetailsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          userId
          user {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getSchoolDetailsBySchoolId.userId).toEqual(
      res.data.getSchoolDetailsBySchoolId.user.id
    );
  });
});

describe('getSchoolDetailsBySchoolId error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Please include a school details ID and try again.';

    const QUERY = `
      query {
        getSchoolDetailsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getSchoolDetailsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get non-existent school details', async () => {
    const EXPECTED_ERROR_MESSAGE = 'School details could not be found.';

    const NONEXISTENT_ID_TO_GET = 0;
    const QUERY = `
      query {
        getSchoolDetailsBySchoolId (
          id: ${NONEXISTENT_ID_TO_GET}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getSchoolDetailsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getAllCredentials query: ', () => {
  it('• should return all credentials data from test seeds', async () => {
    const QUERY = `
      query {
        getAllCredentials {
          id
          name
          description
          txHash
          type
          studentEmail
          imageUrl
          criteria
          valid
          issuedOn
          expirationDate
          schoolId
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getAllCredentials).toEqual(CREDENTIALS_DATA);
  });

  it("• should have matching school user ID's in both schoolId and schoolsUserInfo properties", async () => {
    const QUERY = `
      query {
        getAllCredentials {
          schoolId
          schoolsUserInfo {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getAllCredentials.forEach(credentials => {
      expect(credentials.schoolId).toEqual(credentials.schoolsUserInfo.id);
    });
  });
});

describe('getCredentialById query: ', () => {
  // Will use randomized test input
  it('• should return the corresponding credentials data', async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 3); // Get a random ID within the range of the seed data
    const QUERY = `
      query {
        getCredentialById (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          name
          description
          txHash
          type
          studentEmail
          imageUrl
          criteria
          valid
          issuedOn
          expirationDate
          schoolId
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialById).toEqual(
      CREDENTIALS_DATA[TEST_ID_TO_GET - 1]
    ); // Subtract the ID by 1 to get the corresponding array index
  });

  it("• should have matching school user ID's in both schoolId and schoolsUserInfo properties", async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 3); // Get a random ID within the range of the seed data
    const QUERY = `
      query {
        getCredentialById (
          id: ${TEST_ID_TO_GET}
        ) {
          schoolId
          schoolsUserInfo {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialById.schoolId).toEqual(
      res.data.getCredentialById.schoolsUserInfo.id
    );
  });
});

describe('getCredentialById error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Please include a credential ID and try again.';

    const QUERY = `
      query {
        getCredentialById {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get non-existent credentials', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Credential with that ID could not be found';

    const NONEXISTENT_ID_TO_GET = 0;
    const QUERY = `
      query {
        getCredentialById (
          id: ${NONEXISTENT_ID_TO_GET}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getCredentialsBySchoolId query: ', () => {
  it('• should return the corresponding credentials data for a school that has already issued credentials', async () => {
    const TEST_ID_TO_GET = 5; // School user ID's start at 4; the second school in the data seeds has exactly 1 issued credential
    const EXPECTED_CREDENTIAL_INDEX = 1; // The second school in the data seeds issued the second seeded credential
    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          name
          description
          txHash
          type
          studentEmail
          imageUrl
          criteria
          valid
          issuedOn
          expirationDate
          schoolId
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialsBySchoolId.length).toBe(1);
    expect(res.data.getCredentialsBySchoolId[0]).toEqual(
      CREDENTIALS_DATA[EXPECTED_CREDENTIAL_INDEX]
    );
  });

  it('• should return the corresponding credentials data for a school that has not issued any credentials', async () => {
    const TEST_ID_TO_GET = 6; // School user ID's start at 4; the third school in the data seeds has no issued credentials
    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          name
          description
          txHash
          type
          studentEmail
          imageUrl
          criteria
          valid
          issuedOn
          expirationDate
          schoolId
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialsBySchoolId.length).toBe(0);
  });

  it("• should have matching school user ID's in both schoolId and schoolsUserInfo properties", async () => {
    const TEST_ID_TO_GET = 4; // School user ID's start at 4; the first school in the data seeds has exactly 2 issued credential
    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          schoolId
          schoolsUserInfo {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getCredentialsBySchoolId.forEach(credentials => {
      expect(credentials.schoolId).toEqual(credentials.schoolsUserInfo.id);
    });
  });
});

describe('getCredentialsBySchoolId error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please include a school ID and try again.';

    const QUERY = `
      query {
        getCredentialsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get credentials issued by a non-existent school', async () => {
    const EXPECTED_ERROR_MESSAGE = 'School with that ID could not be found';

    const NONEXISTENT_ID_TO_GET = 0;
    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: ${NONEXISTENT_ID_TO_GET}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});
