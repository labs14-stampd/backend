const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');

const decoded = require('../api/getDecoded');
const dbHelper = require('../models/userModel');

// Re-seed before all mutation tests and after each mutation test to ensure that each test will work with a clean set of data
const cleanUpSeeds = () => db.seed.run();
beforeAll(cleanUpSeeds);
afterEach(cleanUpSeeds);

// should be based on current seed data
const ROLE_COUNT = 4;
const USER_COUNT = 8;

describe('• addUser GQL mutation: ', () => {
  const EXPECTED_NEW_USER_ID = 9; // derived from seeds (ID value auto-increments)
  const EXPECTED_EMAIL = 'johndoe@ymail.com';
  const EXPECTED_USERNAME = 'johndoe';

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
    expectedNewUserRoleID = Math.ceil(Math.random() * ROLE_COUNT);
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
      null
    );
    const actual = res.data.updateUser;

    expect(actual.id).toBe(expectedUserIdToUpdate.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.username).toBe(EXPECTED_UPDATED_USERNAME);
    expect(actual.email).toBe(EXPECTED_UPDATED_EMAIL);
    expect(actual.roleId).toBe(expectedUpdatedRoleId.toString()); // the GraphQL response object will have String-type ID's
  });

  it("• should actually update the corresponding user's information in the database (without affecting other fields)", async () => {
    // Get original user data to check that data fields without specified values are not updated
    const originalUser = await dbHelper.findById(expectedUserIdToUpdate);
    const EXPECTED_PROFILE_PICTURE = originalUser.profilePicture;
    const EXPECTED_SUB = originalUser.sub;

    const EXPECTED_UPDATES = {
      id: expectedUserIdToUpdate,
      username: EXPECTED_UPDATED_USERNAME,
      email: EXPECTED_UPDATED_EMAIL,
      roleId: expectedUpdatedRoleId
    };

    // Initial mutation to update the user
    await graphql(schema, updateUserMutationWithArgs(EXPECTED_UPDATES), null);

    const actualUpdatedUser = await dbHelper.findById(expectedUserIdToUpdate);
    expect(actualUpdatedUser.id).toBe(expectedUserIdToUpdate);
    expect(actualUpdatedUser.username).toBe(EXPECTED_UPDATED_USERNAME);
    expect(actualUpdatedUser.email).toBe(EXPECTED_UPDATED_EMAIL);
    expect(actualUpdatedUser.profilePicture).toBe(EXPECTED_PROFILE_PICTURE);
    expect(actualUpdatedUser.roleId).toBe(expectedUpdatedRoleId);
    expect(actualUpdatedUser.sub).toBe(EXPECTED_SUB);
  });
});

describe('updateUser GQL mutation error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please include a user ID and try again.';

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

  test('• when attempting to update a non-existent user', async () => {
    const EXPECTED_ERROR_MESSAGE = 'User with the given ID not found';

    const MUTATION = `
      mutation {
        updateUser (
          id: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
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

  it('• should return the expected data when deleting a user', async () => {
    const res = await graphql(
      schema,
      deleteUserMutationWithId(expectedUserIdToDelete),
      null
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
    const userToDelete = await dbHelper.findById(expectedUserIdToDelete);
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
      null
    );

    // Attempt to find the user if it still exists (should resolve to falsy value (null/undefined) after deletion)
    const deletedUser = await dbHelper.findById(expectedUserIdToDelete);
    expect(deletedUser).toBeFalsy();
  });
});

describe('deleteUser GQL mutation error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please include a user ID and try again.';

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

  test('• when attempting to delete a non-existent user', async () => {
    const EXPECTED_ERROR_MESSAGE = 'User with the given ID not found';

    const MUTATION = `
      mutation {
        deleteUser (
          id: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.deleteUser).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});
