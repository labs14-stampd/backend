const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');

const decoded = require('../api/getDecoded');
const dbHelper = require('../models/userModel');

// Re-seed before all mutation tests and after each mutation test to ensure that each test will work with a clean set of data
const cleanUpSeeds = () => db.seed.run();
beforeAll(cleanUpSeeds);
afterEach(cleanUpSeeds);

describe('• addUser GQL mutation: ', () => {
  const EXPECTED_NEW_USER_ID = 9; // derived from seeds (ID value auto-increments)
  const EXPECTED_EMAIL = 'johndoe@ymail.com';
  const EXPECTED_USERNAME = 'johndoe';

  const EXPECTED_ROLE_COUNT = 4; // based on role seeds
  let expectedNewUserRoleID; // role ID to use for each addUser mutation test will be randomly generated

  // This addUser mutation will be run in some manner before every test using a provided role ID as a parameter
  const addUserMutationUsingRoleID = roleId => `
    mutation {
      addUser(
        authToken: "${process.env.TEST_TOKEN}"
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
    expectedNewUserRoleID = Math.ceil(Math.random() * EXPECTED_ROLE_COUNT);
  });

  it('• should return the expected data when adding a user that does not yet exist in the database', async () => {
    const res = await graphql(
      schema,
      addUserMutationUsingRoleID(expectedNewUserRoleID),
      null
    );
    const actual = res.data.addUser;
    const decodedActualToken = decoded(actual.token);

    expect(actual.id).toBe(EXPECTED_NEW_USER_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.username).toBe(EXPECTED_USERNAME);
    expect(actual.roleId).toBe(expectedNewUserRoleID.toString()); // the GraphQL response object will have String-type ID's

    expect(decodedActualToken.subject).toBe(EXPECTED_NEW_USER_ID);
    expect(decodedActualToken.email).toBe(EXPECTED_EMAIL);
    expect(decodedActualToken.roleId).toBe(expectedNewUserRoleID);
  });

  it("• should actually insert a new user's information into the database", async () => {
    // Initial mutation to add the user
    await graphql(
      schema,
      addUserMutationUsingRoleID(expectedNewUserRoleID),
      null
    );
    const actualNewUser = await dbHelper.findById(EXPECTED_NEW_USER_ID); // DB helper method to find the newly added user by ID

    expect(actualNewUser.id).toBe(EXPECTED_NEW_USER_ID);
    expect(actualNewUser.username).toBe(EXPECTED_USERNAME);
    expect(actualNewUser.email).toBe(EXPECTED_EMAIL);
    expect(actualNewUser.profilePicture).toBeNull(); // profile picture is not set and should be null by default
    expect(actualNewUser.sub).toBeTruthy(); // string type assumed; sub should not be null, undefined or empty string
    expect(actualNewUser.roleId).toBe(expectedNewUserRoleID);
  });

  // Currently dependent on the test "should actually insert a new user's information into the database"
  it('• should accurately retrieve credentials of an existing user', async () => {
    // Add a new user instead of utilizing seed data so that the mutation can be executed again later using a test token
    await graphql(
      schema,
      addUserMutationUsingRoleID(expectedNewUserRoleID),
      null
    );

    const TEST_NONEXISTENT_USER_ID = 0; // The returned role ID should be the actual user's role ID (not this deliberately incorrect value)
    const res = await graphql(
      schema,
      addUserMutationUsingRoleID(TEST_NONEXISTENT_USER_ID),
      null
    );
    const actual = res.data.addUser;
    const decodedActualToken = decoded(actual.token);

    expect(actual.id).toBe(EXPECTED_NEW_USER_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.username).toBe(EXPECTED_USERNAME);
    expect(actual.roleId).toBe(expectedNewUserRoleID.toString()); // the GraphQL response object will have String-type ID's

    expect(decodedActualToken.subject).toBe(EXPECTED_NEW_USER_ID);
    expect(decodedActualToken.email).toBe(EXPECTED_EMAIL);
    expect(decodedActualToken.roleId).toBe(expectedNewUserRoleID);
  });
});

describe('addUser GQL mutation error handling: ', () => {
  test('• when "authToken" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Authentication token not found or is invalid.';

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
});
