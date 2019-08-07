const { graphql } = require('graphql');
const schema = require('../schema/schema');

const USERDATA = [
  {
    id: '1',
    username: 'admin',
    email: 'teamstampd@gmail.com',
    profilePicture: '',
    roleId: '1',
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
    expect(res.data.getAllUsers).toEqual(USERDATA);
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
    expect(res.data.getUserById).toEqual(USERDATA[TEST_ID_TO_GET - 1]); // Subtract the ID by 1 to get the corresponding array index
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
  test('• when ID parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = "Please include a user ID and try again.";

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
    const EXPECTED_ERROR_MESSAGE = "The user could not be found.";

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
