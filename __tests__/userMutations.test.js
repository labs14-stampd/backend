const getDecoded = require('../api/getDecoded');

const { graphql } = require('graphql');
const schema = require('../schema/schema');
const errorTypes = require('../schema/errors');

const db = require('../database/dbConfig');
const userDbHelper = require('../models/userModel');
const emailDbHelper = require('../models/userEmailsModel');

beforeEach(async () => {
  // Re-seed before each mutation test to ensure that each test will work with a clean set of data
  await db.seed.run();
});
afterAll(async () => {
  // Re-seed after all tests in this test suite to ensure that the next test suite will work with a clean set of data
  await db.seed.run();
  await db.destroy(); // Necessary to prevent connections from not closing (which could eventually clog the Postgres database if left unchecked)
});

// Should be based on current seed data
const ROLE_COUNT = 4;
const USER_COUNT = 9;
const USEREMAIL_COUNT = 4;

describe('addUser GQL mutation: ', () => {
  /*
    Decoded token contents:
    {
      "name": "johndoe@ymail.com",
      "picture": "https://s.gravatar.com/avatar/7b83367dff0ee92c931ae39590fd839d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
      "updated_at": "2019-08-14T15:44:04.256Z",
      "email": "johndoe@ymail.com",
      "email_verified": false,
      "sub": "auth0|5d542c449ad8300dae000bbf",
      "username": "johndoe",
      "iat": 1565800780
    } 
   */
  const TEST_AUTH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZUB5bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvN2I4MzM2N2RmZjBlZTkyYzkzMWFlMzk1OTBmZDgzOWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqby5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wOC0xNFQxNTo0NDowNC4yNTZaIiwiZW1haWwiOiJqb2huZG9lQHltYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYXV0aDB8NWQ1NDJjNDQ5YWQ4MzAwZGFlMDAwYmJmIiwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTY1ODAwNzgwfQ.t9OTsUOHmAigoRqIiL1l2bjmnKeW60dTtBEjNBOTINM';

  const EXPECTED_NEW_USER_ID = USER_COUNT + 1; // derived from seeds (ID value auto-increments)
  const EXPECTED_EMAIL = 'johndoe@ymail.com';
  const EXPECTED_USERNAME = 'johndoe';

  let expectedNewUserRoleId; // role ID to use for each addUser mutation test will be randomly generated

  // This addUser mutation will be run in some manner before every test using a provided role ID as a parameter
  const addUserMutationUsingRoleId = roleId => `
    mutation {
      addUser(
        authToken: "${TEST_AUTH_TOKEN}"
        roleId: ${roleId}
      ) {
        id
        email
        username
        roleId
        token
      }
    }
  `;

  beforeEach(() => {
    // A randomly generated valid role ID will be used to insert a new user in every test within this scope
    expectedNewUserRoleId = Math.ceil(Math.random() * ROLE_COUNT);
  });

  it('• should return the expected data when adding a user that does not yet exist in the database', async () => {
    const res = await graphql(
      schema,
      addUserMutationUsingRoleId(expectedNewUserRoleId),
      null
    );
    const actual = res.data.addUser;
    const decodedActualToken = getDecoded(actual.token);

    expect(actual.id).toBe(EXPECTED_NEW_USER_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.username).toBe(EXPECTED_USERNAME);
    expect(actual.roleId).toBe(expectedNewUserRoleId.toString()); // the GraphQL response object will have String-type ID's

    expect(decodedActualToken.subject).toBe(EXPECTED_NEW_USER_ID);
    expect(decodedActualToken.email).toBe(EXPECTED_EMAIL);
    expect(decodedActualToken.roleId).toBe(expectedNewUserRoleId);
  });

  it("• should actually insert a new user's information into the database", async () => {
    // Initial mutation to add the user
    await graphql(
      schema,
      addUserMutationUsingRoleId(expectedNewUserRoleId),
      null
    );

    const actualNewUser = await userDbHelper.findById(EXPECTED_NEW_USER_ID); // DB helper method to find the newly added user by ID
    expect(actualNewUser.id).toBe(EXPECTED_NEW_USER_ID);
    expect(actualNewUser.username).toBe(EXPECTED_USERNAME);
    expect(actualNewUser.email).toBe(EXPECTED_EMAIL);
    expect(actualNewUser.profilePicture).toBeNull(); // profile picture is not set and should be null by default
    expect(actualNewUser.sub).toBeTruthy(); // string type assumed; sub should not be null, undefined or empty string
    expect(actualNewUser.roleId).toBe(expectedNewUserRoleId);
  });

  // Currently dependent on the test "should actually insert a new user's information into the database"
  it('• should accurately retrieve credentials of an existing user', async () => {
    // Add a new user instead of utilizing seed data so that the mutation can be executed again later using a test token
    await graphql(
      schema,
      addUserMutationUsingRoleId(expectedNewUserRoleId),
      null
    );

    const TEST_NONEXISTENT_USER_ID = 0; // The returned role ID should be the actual user's role ID (not this deliberately incorrect value)
    const res = await graphql(
      schema,
      addUserMutationUsingRoleId(TEST_NONEXISTENT_USER_ID),
      null
    );
    const actual = res.data.addUser;
    const decodedActualToken = getDecoded(actual.token);

    expect(actual.id).toBe(EXPECTED_NEW_USER_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.username).toBe(EXPECTED_USERNAME);
    expect(actual.roleId).toBe(expectedNewUserRoleId.toString()); // the GraphQL response object will have String-type ID's

    expect(decodedActualToken.subject).toBe(EXPECTED_NEW_USER_ID);
    expect(decodedActualToken.email).toBe(EXPECTED_EMAIL);
    expect(decodedActualToken.roleId).toBe(expectedNewUserRoleId);
  });
});

describe('addUser GQL mutation error handling: ', () => {
  test('• when "authToken" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.AUTH_TOKEN;

    const MUTATION = `
      mutation {
        addUser {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when authentication token does not hold valid data', async () => {
    const EXPECTED_ERROR_MESSAGE_START = 'Invalid token specified';

    const MUTATION = `
      mutation {
        addUser (
          authToken: "[SOME INVALID TOKEN....]"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addUser).toBeNull();
    expect(res.errors[0].message.startsWith(EXPECTED_ERROR_MESSAGE_START)).toBe(
      true
    );
  });

  test('• when login is invalid', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.INVALID_LOGIN;

    const mutationWithAuthToken = authToken => `
      mutation {
        addUser (
          authToken: "${authToken}",
          roleId: 1
        ) {
          id
        }
      }
    `;

    /*
      Decoded token contents:
      {
        "name": "johndoe@ymail.com",
        "picture": "https://s.gravatar.com/avatar/7b83367dff0ee92c931ae39590fd839d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
        "updated_at": "2019-08-14T15:44:04.256Z",
        "email": "johndoe@ymail.com",
        "email_verified": false,
        "sub": "auth0|5d542c449ad8300dae000bbf",
        "username": "johndoe",
        "iat": 1565800780
      } 
    */
    const TEST_AUTH_TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZUB5bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvN2I4MzM2N2RmZjBlZTkyYzkzMWFlMzk1OTBmZDgzOWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqby5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wOC0xNFQxNTo0NDowNC4yNTZaIiwiZW1haWwiOiJqb2huZG9lQHltYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYXV0aDB8NWQ1NDJjNDQ5YWQ4MzAwZGFlMDAwYmJmIiwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTY1ODAwNzgwfQ.t9OTsUOHmAigoRqIiL1l2bjmnKeW60dTtBEjNBOTINM';

    // Initial mutation to add the user
    await graphql(schema, mutationWithAuthToken(TEST_AUTH_TOKEN), null);

    /*
      Decoded token contents:
      {
        "name": "johndoe@ymail.com",
        "picture": "https://s.gravatar.com/avatar/7b83367dff0ee92c931ae39590fd839d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
        "updated_at": "2019-08-14T15:44:04.256Z",
        "email": "johndoe@ymail.com",
        "email_verified": false,
        "sub": "[FAKE SUB]",
        "username": "johndoe",
        "iat": 1565800780
      } 
    */
    const INVALID_AUTH_TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZUB5bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvN2I4MzM2N2RmZjBlZTkyYzkzMWFlMzk1OTBmZDgzOWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqby5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wOC0xNFQxNTo0NDowNC4yNTZaIiwiZW1haWwiOiJqb2huZG9lQHltYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiW0ZBS0UgU1VCXSIsInVzZXJuYW1lIjoiam9obmRvZSIsImlhdCI6MTU2NTgwMDc4MH0.f9BbuPtQb5L9XzK-LWtTF-A6unolGpeDi8H2jj-cG4k';

    const res = await graphql(
      schema,
      mutationWithAuthToken(INVALID_AUTH_TOKEN),
      null
    );
    expect(res.data.addUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided role ID does not point to an existing role', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.ROLE;

    /*
      Decoded token contents:
      {
        "name": "johndoe@ymail.com",
        "picture": "https://s.gravatar.com/avatar/7b83367dff0ee92c931ae39590fd839d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
        "updated_at": "2019-08-14T15:44:04.256Z",
        "email": "johndoe@ymail.com",
        "email_verified": false,
        "sub": "auth0|5d542c449ad8300dae000bbf",
        "username": "johndoe",
        "iat": 1565800780
      } 
     */
    const TEST_AUTH_TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZUB5bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvN2I4MzM2N2RmZjBlZTkyYzkzMWFlMzk1OTBmZDgzOWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqby5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wOC0xNFQxNTo0NDowNC4yNTZaIiwiZW1haWwiOiJqb2huZG9lQHltYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYXV0aDB8NWQ1NDJjNDQ5YWQ4MzAwZGFlMDAwYmJmIiwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTY1ODAwNzgwfQ.t9OTsUOHmAigoRqIiL1l2bjmnKeW60dTtBEjNBOTINM';
    const TEST_NONEXISTENT_ROLE_ID = 0;

    const MUTATION = `
      mutation {
        addUser (
          authToken: "${TEST_AUTH_TOKEN}"
          roleId: ${TEST_NONEXISTENT_ROLE_ID}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided username is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.USER.USERNAME;

    /*
      Decoded token contents:
      {
        "name": "johndoe@ymail.com",
        "picture": "https://s.gravatar.com/avatar/7b83367dff0ee92c931ae39590fd839d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
        "updated_at": "2019-08-14T15:44:04.256Z",
        "email": "johndoe@ymail.com",
        "email_verified": false,
        "sub": "auth0|5d542c449ad8300dae000bbf",
        "username": "admin",
        "iat": 1565800780
      } 
     */
    const TEST_AUTH_TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZUB5bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvN2I4MzM2N2RmZjBlZTkyYzkzMWFlMzk1OTBmZDgzOWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqby5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wOC0xNFQxNTo0NDowNC4yNTZaIiwiZW1haWwiOiJqb2huZG9lQHltYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYXV0aDB8NWQ1NDJjNDQ5YWQ4MzAwZGFlMDAwYmJmIiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTU2NTgwMDc4MH0.ANbiFzHse0r-PlFt6Rsvi4bueS2aphGdimmTIHGORts';

    const MUTATION = `
      mutation {
        addUser (
          authToken: "${TEST_AUTH_TOKEN}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided sub value is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.USER.SUB;

    /*
      Decoded token contents:
      {
        "name": "johndoe@ymail.com",
        "picture": "https://s.gravatar.com/avatar/7b83367dff0ee92c931ae39590fd839d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjo.png",
        "updated_at": "2019-08-14T15:44:04.256Z",
        "email": "johndoe@ymail.com",
        "email_verified": false,
        "sub": "1",
        "username": "johndoe",
        "iat": 1565800780
      }
     */
    const TEST_AUTH_TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZUB5bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvN2I4MzM2N2RmZjBlZTkyYzkzMWFlMzk1OTBmZDgzOWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZqby5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wOC0xNFQxNTo0NDowNC4yNTZaIiwiZW1haWwiOiJ0cnVmZmxpbi53YWZmbGVzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiMSIsInVzZXJuYW1lIjoiam9obmRvZSIsImlhdCI6MTU2NTgwMDc4MH0.mDNNSIDeRJDChjinJPo8qxMzJ4F8xSwNPMbMvg3HC8c';

    const MUTATION = `
      mutation {
        addUser (
          authToken: "${TEST_AUTH_TOKEN}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('updateUser GQL mutation: ', () => {
  let expectedUserIdToUpdate; // user to update for each updateUser mutation test will be randomly selected among seed data
  const EXPECTED_UPDATED_USERNAME = 'newname';
  const EXPECTED_UPDATED_EMAIL = 'new@latest.next';
  let expectedUpdatedRoleId;

  beforeEach(() => {
    // Randomly generate valid test ID's before each test
    expectedUserIdToUpdate = Math.ceil(Math.random() * USER_COUNT);
    expectedUpdatedRoleId = Math.ceil(Math.random() * ROLE_COUNT);
  });

  // The mutation string below will be reused for this group of tests
  const updateUserMutationWithArgs = args => `
    mutation {
      updateUser (
        id: ${args.id}
        username: "${args.username}"
        email: "${args.email}"
        roleId: ${args.roleId}
      ) {
        id
        username
        email
        roleId
      }
    }
  `;

  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it("• should return the expected data when updating a user's information", async () => {
    const EXPECTED_UPDATES = {
      id: expectedUserIdToUpdate,
      username: EXPECTED_UPDATED_USERNAME,
      email: EXPECTED_UPDATED_EMAIL,
      roleId: expectedUpdatedRoleId
    };

    const res = await graphql(
      schema,
      updateUserMutationWithArgs(EXPECTED_UPDATES),
      null,
      authContext
    );
    const actual = res.data.updateUser;

    expect(actual.id).toBe(expectedUserIdToUpdate.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.username).toBe(EXPECTED_UPDATED_USERNAME);
    expect(actual.email).toBe(EXPECTED_UPDATED_EMAIL);
    expect(actual.roleId).toBe(expectedUpdatedRoleId.toString()); // the GraphQL response object will have String-type ID's
  });

  it("• should actually update the corresponding user's information in the database (without affecting other fields)", async () => {
    // Get original user data to check that data fields without specified values are not updated
    const originalUser = await userDbHelper.findById(expectedUserIdToUpdate);
    const EXPECTED_PROFILE_PICTURE = originalUser.profilePicture;
    const EXPECTED_SUB = originalUser.sub;

    const EXPECTED_UPDATES = {
      id: expectedUserIdToUpdate,
      username: EXPECTED_UPDATED_USERNAME,
      email: EXPECTED_UPDATED_EMAIL,
      roleId: expectedUpdatedRoleId
    };

    // Initial mutation to update the user
    await graphql(
      schema,
      updateUserMutationWithArgs(EXPECTED_UPDATES),
      null,
      authContext
    );

    const actualUpdatedUser = await userDbHelper.findById(
      expectedUserIdToUpdate
    ); // DB helper method to find the updated school details entry by ID
    expect(actualUpdatedUser.id).toBe(expectedUserIdToUpdate);
    expect(actualUpdatedUser.username).toBe(EXPECTED_UPDATED_USERNAME);
    expect(actualUpdatedUser.email).toBe(EXPECTED_UPDATED_EMAIL);
    expect(actualUpdatedUser.profilePicture).toBe(EXPECTED_PROFILE_PICTURE);
    expect(actualUpdatedUser.roleId).toBe(expectedUpdatedRoleId);
    expect(actualUpdatedUser.sub).toBe(EXPECTED_SUB);
  });
});

describe('updateUser GQL mutation error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const MUTATION = `
      mutation {
        updateUser {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.USER.ID;

    const MUTATION = `
      mutation {
        updateUser {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to update a non-existent user', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.USER;

    const MUTATION = `
      mutation {
        updateUser (
          id: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided role ID does not point to an existing role', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.ROLE;

    const TEST_ID_TO_UPDATE = 1;
    const TEST_NONEXISTENT_ROLE_ID = 0;

    const MUTATION = `
      mutation {
        updateUser (
          id: ${TEST_ID_TO_UPDATE}
          roleId: ${TEST_NONEXISTENT_ROLE_ID}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided username is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.USER.USERNAME;

    // Should be based on current seed data
    const TEST_ID_TO_UPDATE = 1;
    const EXISTING_USERNAME = 'admin2';
    const MUTATION = `
      mutation {
        updateUser (
          id: ${TEST_ID_TO_UPDATE}
          username: "${EXISTING_USERNAME}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided email is not unique (within "users" table)', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.EMAIL_ADDRESS;

    // Should be based on current seed data
    const TEST_ID_TO_UPDATE = 1;
    const EXISTING_EMAIL = 'school@school.edu';
    const MUTATION = `
      mutation {
        updateUser (
          id: ${TEST_ID_TO_UPDATE}
          email: "${EXISTING_EMAIL}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided email is not unique (within "userEmails" table)', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.EMAIL_ADDRESS;

    // Should be based on current seed data
    const TEST_ID_TO_UPDATE = 1;
    const EXISTING_EMAIL = 'learners.learn@study.edu';
    const MUTATION = `
      mutation {
        updateUser (
          id: ${TEST_ID_TO_UPDATE}
          email: "${EXISTING_EMAIL}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.updateUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('deleteUser GQL mutation: ', () => {
  let expectedUserIdToDelete; // user to delete for each deleteUser mutation test will be randomly selected among seed data

  beforeEach(() => {
    // Randomly generate valid test ID's before each test
    expectedUserIdToDelete = Math.ceil(Math.random() * USER_COUNT);
  });

  const deleteUserMutationWithId = id => `
    mutation {
      deleteUser (
        id: ${id}
      ) {
        id
        username
        profilePicture
        roleId
      }
    }
  `;

  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return the expected data when deleting a user', async () => {
    const res = await graphql(
      schema,
      deleteUserMutationWithId(expectedUserIdToDelete),
      null,
      authContext
    );
    const actual = res.data.deleteUser;

    // All fields except for ID should be null after user deletion (mutation string will not return non-nullable fields to avoid GQL errors)
    expect(actual.id).toBe(expectedUserIdToDelete.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.username).toBeNull();
    expect(actual.profilePicture).toBeNull();
    expect(actual.roleId).toBeNull();
  });

  it('• should actually delete the corresponding user from the database', async () => {
    // Confirm that the user to delete actually existed at first
    const userToDelete = await userDbHelper.findById(expectedUserIdToDelete);
    try {
      // Try catch for throwing error with custom message - if the matcher fails, an exception will occur, leading to the catch block
      expect(userToDelete).toBeTruthy();
    } catch {
      throw new Error(
        'Testing error: the ID to delete must belong to an existing user in the data seeds!'
      ); // Testing error message if try block fails
    }

    // Delete the randomly selected user
    await graphql(
      schema,
      deleteUserMutationWithId(expectedUserIdToDelete),
      null,
      authContext
    );

    // Attempt to find the user if it still exists (should resolve to falsy value - null/undefined - after deletion)
    const deletedUser = await userDbHelper.findById(expectedUserIdToDelete);
    expect(deletedUser).toBeFalsy();
  });
});

describe('deleteUser GQL mutation error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const MUTATION = `
      mutation {
        deleteUser {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.deleteUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.USER.ID;

    const MUTATION = `
      mutation {
        deleteUser {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.deleteUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to delete a non-existent user', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.USER;

    const MUTATION = `
      mutation {
        deleteUser (
          id: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.deleteUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('addUserEmail GQL mutation: ', () => {
  const EXPECTED_NEW_USEREMAIL_ID = USEREMAIL_COUNT + 1;
  const EXPECTED_EMAIL = 'aquaman@rocketmail.com';
  let expectedValid;
  const EXPECTED_NEW_USEREMAIL_USER_ID = 8;
  const EXPECTED_ADDED_CREDENTIAL_ID = 3;

  beforeEach(() => {
    // Randomize field values of the incoming user email entry
    expectedValid = Boolean((Math.random() * 2) | 0);
  });

  // The mutation string below will be reused for this group of tests
  const addUserEmailMutationWithEmail = email => `
    mutation {
      addUserEmail (
        email: "${email}"
        valid: ${expectedValid}
        userId: ${EXPECTED_NEW_USEREMAIL_USER_ID}
      ) {
        id
        email
        valid
        userId
        credentials {
          id
        }
      }
    }
  `;

  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return the expected data when adding new user email information', async () => {
    const res = await graphql(
      schema,
      addUserEmailMutationWithEmail(EXPECTED_EMAIL),
      null,
      authContext
    );
    const actual = res.data.addUserEmail;

    expect(actual.id).toBe(EXPECTED_NEW_USEREMAIL_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.valid).toBe(expectedValid);
    expect(actual.userId).toBe(EXPECTED_NEW_USEREMAIL_USER_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.credentials[0].id).toBe(
      EXPECTED_ADDED_CREDENTIAL_ID.toString()
    ); // the GraphQL response object will have String-type ID's
  });

  it('• should actually insert the new user email information into the database', async () => {
    // Initial mutation to add the new user email information
    await graphql(
      schema,
      addUserEmailMutationWithEmail(EXPECTED_EMAIL),
      null,
      authContext
    );

    const actualNewUserEmail = await emailDbHelper.findById(
      // DB helper method to find the newly added user email information by ID
      EXPECTED_NEW_USEREMAIL_ID
    );
    expect(actualNewUserEmail.id).toBe(EXPECTED_NEW_USEREMAIL_ID);
    expect(actualNewUserEmail.email).toBe(EXPECTED_EMAIL);
    expect(actualNewUserEmail.valid).toBe(expectedValid);
    expect(actualNewUserEmail.userId).toBe(EXPECTED_NEW_USEREMAIL_USER_ID);
  });
});

describe('addUserEmail GQL mutation error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const MUTATION = `
      mutation {
        addUserEmail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "email" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.USEREMAIL.EMAIL;

    const MUTATION = `
      mutation {
        addUserEmail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.addUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "userId" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.USER.ID;

    const MUTATION = `
      mutation {
        addUserEmail (
          email: "test@test.test"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.addUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided user ID does not belong to an existing user', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.USER;

    const MUTATION = `
      mutation {
        addUserEmail (
          email: "test@test.test"
          userId: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.addUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided email is not unique (within "userEmails" table)', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.EMAIL_ADDRESS;

    // Should be based on current seed data (specifically the email addresses in the "userEmails" table)
    const EXISTING_EMAIL = 'trufflin.waffles@gmail.com';

    // Randomize field values of the incoming user email entry
    const expectedNewUserId = [6, 7, 8][(Math.random() * 3) | 0];

    const MUTATION = `
      mutation {
        addUserEmail (
          email: "${EXISTING_EMAIL}"
          userId: ${expectedNewUserId}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.addUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided email is not unique (within "users" table)', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_UNIQUE.EMAIL_ADDRESS;

    // Should be based on current seed data (specifically the email addresses in the "users" table)
    const EXISTING_EMAIL = 'notadud@yandex.com';

    // Randomize field values of the incoming user email entry
    const expectedNewUserId = [6, 7, 8][(Math.random() * 3) | 0];

    const MUTATION = `
      mutation {
        addUserEmail (
          email: "${EXISTING_EMAIL}"
          userId: ${expectedNewUserId}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.addUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('deleteUserEmail GQL mutation: ', () => {
  let expectedUserEmailIdToDelete;

  beforeEach(() => {
    // Randomly generate valid test ID's before each test
    expectedUserEmailIdToDelete = Math.ceil(Math.random() * USEREMAIL_COUNT);
  });

  const deleteUserEmailMutationWithId = id => `
    mutation {
      deleteUserEmail (
        id: ${id}
      ) {
        id
        email
        valid
      }
    }
  `;

  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  it('• should return the expected data when deleting user email information', async () => {
    const res = await graphql(
      schema,
      deleteUserEmailMutationWithId(expectedUserEmailIdToDelete),
      null,
      authContext
    );
    const actual = res.data.deleteUserEmail;

    // All fields except for ID should be null after user deletion (mutation string will not return non-nullable fields to avoid GQL errors)
    expect(actual.id).toBe(expectedUserEmailIdToDelete.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBeNull();
    expect(actual.valid).toBeNull();
  });

  it('• should actually delete the corresponding user email information from the database', async () => {
    // Confirm that the user email information to delete actually existed at first
    const userEmailToDelete = await userDbHelper.findById(
      expectedUserEmailIdToDelete
    );
    try {
      // Try catch for throwing error with custom message - if the matcher fails, an exception will occur, leading to the catch block
      expect(userEmailToDelete).toBeTruthy();
    } catch {
      throw new Error(
        'Testing error: the ID to delete must belong to some existing user email information in the data seeds!'
      ); // Testing error message if try block fails
    }

    // Delete the randomly selected user email information
    await graphql(
      schema,
      deleteUserEmailMutationWithId(expectedUserEmailIdToDelete),
      null,
      authContext
    );

    // Attempt to find the user email information if it still exists (should resolve to falsy value - null/undefined - after deletion)
    const deletedUserEmail = await emailDbHelper.findById(
      expectedUserEmailIdToDelete
    );
    expect(deletedUserEmail).toBeFalsy();
  });
});

describe('deleteUserEmail GQL mutation error handling: ', () => {
  // Context object to provide authorization
  const authContext = {
    roleId: 1
  };

  test('• when unauthorized', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.UNAUTHORIZED;

    const MUTATION = `
      mutation {
        deleteUserEmail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.deleteUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.MISSING_PARAMETER.USEREMAIL.ID;

    const MUTATION = `
      mutation {
        deleteUserEmail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.deleteUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to delete non-existent user email information', async () => {
    const EXPECTED_ERROR_MESSAGE = errorTypes.NOT_FOUND.USEREMAIL;

    const MUTATION = `
      mutation {
        deleteUserEmail (
          id: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null, authContext);
    expect(res.data.deleteUserEmail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});
