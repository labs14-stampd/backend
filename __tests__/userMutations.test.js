const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');
const decoded = require('../api/getDecoded');

// •

afterEach(() => {
  return db.seed.run();
});

describe('• addUser mutation: ', () => {
  it('• should return the expected data from adding a user that does not yet exist in the database', async () => {
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

    const actualDecodedToken = decoded(actual.token);

    expect(actual.id).toBe(`${EXPECTED_USER_ID}`);
    expect(actual.email).toBe(EXPECTED_EMAIL);
    expect(actual.username).toBe(EXPECTED_USERNAME);
    expect(actual.roleId).toBe(`${EXPECTED_ROLE_ID}`);

    expect(actualDecodedToken.subject).toBe(EXPECTED_USER_ID);
    expect(actualDecodedToken.email).toBe(EXPECTED_EMAIL);
    expect(actualDecodedToken.roleId).toBe(EXPECTED_ROLE_ID);
  });
});
