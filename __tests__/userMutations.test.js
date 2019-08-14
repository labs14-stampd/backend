const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');

const decoded = require('../api/getDecoded');

// Re-seed before all mutation tests and after each mutation test to ensure that each test will work with a clean set of data
const cleanUpSeeds = () => db.seed.run();
beforeAll(cleanUpSeeds);
afterEach(cleanUpSeeds);

describe('• addUser mutation: ', () => {
  it('• should return the expected data when adding a user that does not yet exist in the database', async () => {
    const EXPECTED_USER_ID = 9;
    const EXPECTED_EMAIL = 'johndoe@ymail.com';
    const EXPECTED_USERNAME = 'johndoe';
    const EXPECTED_ROLE_ID = 2;

    const MUTATION = `
      mutation {
        addUser(
          authToken: "${process.env.TEST_TOKEN}"
          roleId: ${EXPECTED_ROLE_ID}
        ) {
          id
          email
          username
          roleId
          token
        }
      }
    `;
    const res = await graphql(schema, MUTATION, null);

    const actual = res.data.addUser;

    const decodedActualToken = decoded(actual.token);

    expect(actual.id).toBe(EXPECTED_USER_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.username).toBe(EXPECTED_USERNAME);
    expect(actual.roleId).toBe(EXPECTED_ROLE_ID.toString()); // the GraphQL response object will have String-type ID's

    expect(decodedActualToken.subject).toBe(EXPECTED_USER_ID);
    expect(decodedActualToken.email).toBe(EXPECTED_EMAIL);
    expect(decodedActualToken.roleId).toBe(EXPECTED_ROLE_ID);
  });
});
