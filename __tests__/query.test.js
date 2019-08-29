const { graphql } = require('graphql');
const schema = require('../schema/schema');
const errorTypes = require('../schema/errors');

const db = require('../database/dbConfig');

beforeAll(async () => {
  // Re-seed before all query tests to ensure that each test will work with a clean set of data
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy(); // Necessary to prevent connections from not closing (which could eventually clog the Postgres database if left unchecked)
});

const USER_DATA = [
  {
    id: '1',
    username: 'admin',
    email: 'schoolzrus@rocketmail.com',
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
    email: 'teamstampd@gmail.com',
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
  },
  {
    id: '9',
    username: 'test_school',
    email: 'skollboii@studytest.edu',
    profilePicture: '',
    roleId: '2',
    sub: '9'
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
    userId: '2'
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
    userId: '7'
  },
  {
    id: '4',
    name: 'School of the Norf',
    taxId: '000000003',
    street1: 'Compton streats',
    street2: null,
    city: 'Los Angel-less',
    state: 'HA',
    zip: '00000',
    phone: '999-9999',
    type: 'College',
    url: 'https://www.norfofthewoods.edu/',
    userId: '5'
  },
  {
    id: '5',
    name: 'School of the Hupplepuff',
    taxId: '000000004',
    street1: 'Sweet streats',
    street2: null,
    city: 'Sweet City',
    state: 'HA',
    zip: '00000',
    phone: '999-9999',
    type: 'College',
    url: 'https://www.hp.edu/',
    userId: '6'
  },
  {
    id: '6',
    name: 'School of the slytherin',
    taxId: '000000005',
    street1: 'Sweet streats',
    street2: null,
    city: 'Sweet City',
    state: 'HA',
    zip: '00000',
    phone: '999-9999',
    type: 'College',
    url: 'https://www.wow.edu/',
    userId: '4'
  },
  {
    id: '7',
    name: 'School of the gryff',
    taxId: '000000006',
    street1: 'Sweet streats',
    street2: null,
    city: 'Sweet City',
    state: 'HA',
    zip: '00000',
    phone: '999-9999',
    type: 'College',
    url: 'https://www.nice.edu/',
    userId: '8'
  },
  {
    id: '8',
    name: 'School of the otherone',
    taxId: '000000007',
    street1: 'Sweet streats',
    street2: null,
    city: 'Sweet City',
    state: 'HA',
    zip: '00000',
    phone: '999-9999',
    type: 'College',
    url: 'https://www.kayn.edu/',
    userId: '1'
  }
];

const CREDENTIALS_DATA = [
  {
    id: '1',
    credName: 'Masters in Gravitational Engineering',
    description:
      'Certifies that this person is capable of engineering while in a gravitational field',
    credHash: '',
    txHash: '',
    type: 'Masters',
    ownerName: 'Franklin Hall',
    studentEmail: 'graviton@gmail.com',
    imageUrl: '',
    criteria: 'Complete Engineering of a gavitational field',
    valid: true,
    issuedOn: '08/08/2016',
    expirationDate: '09/09/2040',
    schoolId: '3'
  },
  {
    id: '2',
    credName: 'B.A. in Classical Horsemanship',
    description:
      'Certifies that this person is capable of handling horses in a classical fashion',
    credHash: '',
    txHash: '',
    type: "Bachelor's",
    ownerName: 'Batchman',
    studentEmail: 'batchman@baidu.com',
    imageUrl: '',
    criteria: 'Complete Horsemanship at the Classical Level',
    valid: false,
    issuedOn: '08/09/2011',
    expirationDate: '09/09/2040',
    schoolId: '3'
  },
  {
    id: '3',
    credName: 'PhD in Underwater Blow Torching',
    description:
      'Certifies that this person is capable of handling a blow torch underwater',
    credHash: '',
    txHash: '',
    type: 'PhD',
    ownerName: 'Water Boi',
    studentEmail: 'aquaman@rocketmail.com',
    imageUrl: '',
    criteria: 'Complete Underwater Blowtorching at an Advanced Proficiency',
    valid: true,
    issuedOn: '02/02/2017',
    expirationDate: '09/09/2040',
    schoolId: '3'
  },
  {
    id: '4',
    credName: 'Bachelor in Gravitational Engineering',
    description:
      'Certifies that this person is capable of engineering while in a gravitational field',
    credHash: '',
    txHash: '',
    type: 'Masters',
    ownerName: 'Billonar Plebui',
    studentEmail: 'eligiblebachelor@hey.net',
    imageUrl: '',
    criteria: 'Complete Engineering of a gavitational field',
    valid: true,
    issuedOn: '08/08/2016',
    expirationDate: '09/09/2040',
    schoolId: '5'
  },
  {
    id: '5',
    credName: 'Doctorate in Classical Horsemanship',
    description:
      'Certifies that this person is capable of handling horses in a classical fashion',
    credHash: '',
    txHash: '',
    type: "Bachelor's",
    ownerName: 'Hao Dee',
    studentEmail: 'howdy@neighquestr.com',
    imageUrl: '',
    criteria: 'Complete Horsemanship at the Classical Level',
    valid: false,
    issuedOn: '08/09/2011',
    expirationDate: '09/09/2040',
    schoolId: '4'
  },
  {
    id: '6',
    credName: "Associate's Degree in Underwater Blow Torching",
    description:
      'Certifies that this person is capable of handling a blow torch underwater',
    credHash: '',
    txHash: '',
    type: 'PhD',
    ownerName: 'Hao Dee',
    studentEmail: 'howdy@neighquestr.com',
    imageUrl: '',
    criteria: 'Complete Underwater Blowtorching at an Advanced Proficiency',
    valid: true,
    issuedOn: '02/02/2017',
    expirationDate: '09/09/2040',
    schoolId: '4'
  }
];

describe('getAllUsers GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

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

    const res = await graphql(schema, QUERY, null, authContext);
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

    const res = await graphql(schema, QUERY, null, authContext);
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

    const res = await graphql(schema, QUERY, null, authContext);
    res.data.getAllUsers.forEach(user => {
      if (user.roleId != '2' && user.role.id != '2') {
        // Role ID number for schools is 2
        expect(user.schoolDetails).toBeNull();
      }
    });
  });
});

describe('getAllUsers GQL query error handling: ', () => {
  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getAllUsers {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getAllUsers).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getUserById GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    isAuth: true
  };

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

    const res = await graphql(schema, QUERY, null, authContext);
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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getUserById.roleId).toEqual(res.data.getUserById.role.id);
  });

  it('• should have null value for schoolDetails property if user is not a school', async () => {
    // Get a random ID within the range of the user seed ID's that does not belong to a school user
    const IDS_TO_EXCLUDE = [1, 3, 4, 5, 9];
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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getUserById.schoolDetails).toBeNull();
  });
});

describe('getUserById GQL query error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    isAuth: true
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getUserById (
          id: ""
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getUserById).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.USER.ID;

    const QUERY = `
      query {
        getUserById {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getUserById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when data input type of "id" parameter is incorrect', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.TYPE_MISMATCH.USER.ID;

    const QUERY = `
      query {
        getUserById (
          id: "[INVALID NUMBER]"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getUserById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get a non-existent user', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.USER;

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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getUserById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getSchoolDetailsBySchoolId GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 2
  };

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

    const res = await graphql(schema, QUERY, null, authContext);
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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getSchoolDetailsBySchoolId.userId).toEqual(
      res.data.getSchoolDetailsBySchoolId.user.id
    );
  });
});

describe('getSchoolDetailsBySchoolId GQL query error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 2
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getSchoolDetailsBySchoolId (
          id: ""
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getSchoolDetailsBySchoolId).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.ID;

    const QUERY = `
      query {
        getSchoolDetailsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getSchoolDetailsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when data input type of "id" parameter is incorrect', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.TYPE_MISMATCH.SCHOOLDETAIL.ID;

    const QUERY = `
      query {
        getSchoolDetailsBySchoolId (
          id: "[INVALID NUMBER]"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getSchoolDetailsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get non-existent school details', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.SCHOOLDETAIL;

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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getSchoolDetailsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getAllCredentials GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return all credentials data from test seeds', async () => {
    const QUERY = `
      query {
        getAllCredentials {
          id
          credName
          description
          credHash
          txHash
          type
          ownerName
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

    const res = await graphql(schema, QUERY, null, authContext);
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

    const res = await graphql(schema, QUERY, null, authContext);
    res.data.getAllCredentials.forEach(credentials => {
      expect(credentials.schoolId).toEqual(credentials.schoolsUserInfo.id);
    });
  });
});

describe('getAllCredentials GQL query error handling: ', () => {
  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getAllCredentials {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getAllCredentials).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getCredentialById GQL query: ', () => {
  // Will use randomized test input
  it('• should return the corresponding credentials data', async () => {
    const TEST_ID_TO_GET = Math.ceil(Math.random() * 3); // Get a random ID within the range of the seed data
    const QUERY = `
      query {
        getCredentialById (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          credName
          description
          credHash
          txHash
          type
          ownerName
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

describe('getCredentialById GQL query error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.CREDENTIAL.ID;

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

  test('• when data input type of "id" parameter is incorrect', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.TYPE_MISMATCH.CREDENTIAL.ID;

    const QUERY = `
      query {
        getCredentialById (
          id: "[INVALID NUMBER]"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialById).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get non-existent credentials', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.CREDENTIAL;

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

describe('getCredentialsBySchoolId GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return the corresponding credentials data for a school that has already issued credentials', async () => {
    // Should be based on current seed data
    const TEST_ID_TO_GET = 5;
    const EXPECTED_CREDENTIAL_INDEX = 3;

    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          id
          credName
          description
          credHash
          txHash
          type
          ownerName
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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsBySchoolId.length).toBe(1);
    expect(res.data.getCredentialsBySchoolId[0]).toEqual(
      CREDENTIALS_DATA[EXPECTED_CREDENTIAL_INDEX]
    );
  });

  it('• should return the corresponding credentials data for a school that has not issued any credentials', async () => {
    // Should be based on current seed data
    const TEST_ID_TO_GET = 6;

    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          id
        }
      }
    `; // Query should only ask for ID since the idea is to simply expect an empty list

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsBySchoolId.length).toBe(0);
  });

  it("• should have matching school user ID's in both schoolId and schoolsUserInfo properties", async () => {
    // Should be based on current seed data
    const TEST_ID_TO_GET = 4;

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

    const res = await graphql(schema, QUERY, null, authContext);
    res.data.getCredentialsBySchoolId.forEach(credentials => {
      expect(credentials.schoolId).toEqual(credentials.schoolsUserInfo.id);
    });
  });
});

describe('getCredentialsBySchoolId GQL query error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getCredentialsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.ID;

    const QUERY = `
      query {
        getCredentialsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when data input type of "id" parameter is incorrect', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.TYPE_MISMATCH.SCHOOLDETAIL.ID;

    const QUERY = `
      query {
        getCredentialsBySchoolId (
          id: "[INVALID NUMBER]"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get credentials issued by a non-existent school', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.SCHOOLDETAIL;

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

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getCredentialsByEmail GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return the corresponding credentials data for an email address that has some credentials issued to it', async () => {
    // Should be based on current seed data
    const TEST_EMAIL_TO_GET = 'howdy@neighquestr.com';
    const EXPECTED_CREDENTIALS = [CREDENTIALS_DATA[4], CREDENTIALS_DATA[5]];

    const QUERY = `
      query {
        getCredentialsByEmail (
          email: "${TEST_EMAIL_TO_GET}"
        ) {
          id
          credName
          description
          credHash
          txHash
          type
          ownerName
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

    const res = await graphql(schema, QUERY, null, authContext);
    const actualCredentials = res.data.getCredentialsByEmail;

    expect(actualCredentials.length).toBe(EXPECTED_CREDENTIALS.length);
    for (let i = 0; i < EXPECTED_CREDENTIALS.length; i++) {
      expect(actualCredentials[i]).toEqual(EXPECTED_CREDENTIALS[i]);
    }
  });

  it('• should return the corresponding credentials data for an email address that does not have any credentials issued to it', async () => {
    // Should be based on current seed data
    const TEST_EMAIL_TO_GET = 'nonexistent@example.com';

    const QUERY = `
      query {
        getCredentialsByEmail (
          email: "${TEST_EMAIL_TO_GET}"
        ) {
          id
        }
      }
    `; // Query should only ask for ID since the idea is to simply expect an empty list

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsByEmail.length).toBe(0);
  });
});

describe('getCredentialsByEmail GQL query error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getCredentialsByEmail (
          email: ""
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getCredentialsByEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "email" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.EMAIL_ADDRESS;

    const QUERY = `
      query {
        getCredentialsByEmail { 
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getCredentialsByEmail).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});

describe('getDeletedCredentialsBySchoolId GQL query: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return the corresponding deleted credentials data for a school that has not deleted any credentials', async () => {
    // Should be based on current seed data
    const TEST_ID_TO_GET = 6;

    const QUERY = `
      query {
        getDeletedCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          id
        }
      }
    `; // Query should only ask for ID since the idea is to simply expect an empty list

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getDeletedCredentialsBySchoolId.length).toBe(0);
  });

  it("• should have matching school user ID's in both schoolId and schoolsUserInfo properties", async () => {
    // Should be based on current seed data
    const TEST_ID_TO_GET = 4;

    const QUERY = `
      query {
        getDeletedCredentialsBySchoolId (
          id: ${TEST_ID_TO_GET}
        ) {
          schoolId
          schoolsUserInfo {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    res.data.getDeletedCredentialsBySchoolId.forEach(credentials => {
      expect(credentials.schoolId).toEqual(credentials.schoolsUserInfo.id);
    });
  });
});

describe('getDeletedCredentialsBySchoolId GQL query error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const QUERY = `
      query {
        getDeletedCredentialsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    expect(res.data.getDeletedCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.ID;

    const QUERY = `
      query {
        getDeletedCredentialsBySchoolId {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getDeletedCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when data input type of "id" parameter is incorrect', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.TYPE_MISMATCH.SCHOOLDETAIL.ID;

    const QUERY = `
      query {
        getDeletedCredentialsBySchoolId (
          id: "[INVALID NUMBER]"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getDeletedCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to get deleted credentials from a non-existent school', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.SCHOOLDETAIL;

    const NONEXISTENT_ID_TO_GET = 0;
    const QUERY = `
      query {
        getDeletedCredentialsBySchoolId (
          id: ${NONEXISTENT_ID_TO_GET}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, QUERY, null, authContext);
    expect(res.data.getDeletedCredentialsBySchoolId).toBeNull();
    expect(res.errors[0].message).toEqual(EXPECTED_ERROR_MESSAGE);
  });
});
