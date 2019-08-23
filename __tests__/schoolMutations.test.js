const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');

const dbHelper = require('../models/schoolModel');

beforeEach(async () => {
  // Re-seed before all mutation tests to ensure that each test will work with a clean set of data
  await db.seed.run();
});
afterAll(async () => {
  // Re-seed after all tests in this test suite to ensure that the next test suite will work with a clean set of data
  await db.seed.run();
  await db.destroy(); // Necessary to prevent connections from not closing (which could eventually clog the Postgres database if left unchecked)
});

// Should be based on current seed data
const USER_COUNT = 9;
const SCHOOLDETAIL_COUNT = 8;

describe('addSchoolDetail GQL mutation: ', () => {
  const EXPECTED_NEW_SCHOOLDETAIL_ID = SCHOOLDETAIL_COUNT + 1;
  const EXPECTED_NAME = 'Test School';
  const EXPECTED_TAX_ID = '40-4040404';
  const EXPECTED_STREET1 = '404 St.';
  const EXPECTED_STREET2 = 'Forohfor Town';
  const EXPECTED_CITY = 'Lost City';
  const EXPECTED_STATE = 'HA';
  const EXPECTED_ZIP = '40404';
  const EXPECTED_TYPE = 'testing';
  const EXPECTED_PHONE = '404-404-0404';
  const EXPECTED_URL = 'anavela.bolnamber.nt.fnd';
  const EXPECTED_NEW_SCHOOLDETAIL_USER_ID = USER_COUNT;

  // The mutation string below will be reused for this group of tests
  const MUTATION = `
    mutation {
      addSchoolDetail(
        name: "${EXPECTED_NAME}"
        taxId: "${EXPECTED_TAX_ID}"
        street1: "${EXPECTED_STREET1}"
        street2: "${EXPECTED_STREET2}"
        city: "${EXPECTED_CITY}"
        state: "${EXPECTED_STATE}"
        zip: "${EXPECTED_ZIP}"
        type: "${EXPECTED_TYPE}"
        phone: "${EXPECTED_PHONE}"
        url: "${EXPECTED_URL}"
        userId: ${EXPECTED_NEW_SCHOOLDETAIL_USER_ID}
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

  it('• should return the expected data when adding a school details entry', async () => {
    const res = await graphql(schema, MUTATION, null);
    const actual = res.data.addSchoolDetail;

    expect(actual.id).toBe(EXPECTED_NEW_SCHOOLDETAIL_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.name).toBe(EXPECTED_NAME);
    expect(actual.taxId).toBe(EXPECTED_TAX_ID);
    expect(actual.street1).toBe(EXPECTED_STREET1);
    expect(actual.street2).toBe(EXPECTED_STREET2);
    expect(actual.city).toBe(EXPECTED_CITY);
    expect(actual.state).toBe(EXPECTED_STATE);
    expect(actual.zip).toBe(EXPECTED_ZIP);
    expect(actual.type).toBe(EXPECTED_TYPE);
    expect(actual.phone).toBe(EXPECTED_PHONE);
    expect(actual.url).toBe(EXPECTED_URL);
    expect(actual.userId).toBe(EXPECTED_NEW_SCHOOLDETAIL_USER_ID.toString()); // the GraphQL response object will have String-type ID's
  });

  it('• should actually insert a new school details entry into the database', async () => {
    // Initial mutation to add the school
    await graphql(schema, MUTATION, null);

    const actualNewSchoolDetail = await dbHelper.findById(
      EXPECTED_NEW_SCHOOLDETAIL_ID
    ); // DB helper method to find the newly added school details entry by ID
    expect(actualNewSchoolDetail.id).toBe(EXPECTED_NEW_SCHOOLDETAIL_ID);
    expect(actualNewSchoolDetail.name).toBe(EXPECTED_NAME);
    expect(actualNewSchoolDetail.taxId).toBe(EXPECTED_TAX_ID);
    expect(actualNewSchoolDetail.street1).toBe(EXPECTED_STREET1);
    expect(actualNewSchoolDetail.street2).toBe(EXPECTED_STREET2);
    expect(actualNewSchoolDetail.city).toBe(EXPECTED_CITY);
    expect(actualNewSchoolDetail.state).toBe(EXPECTED_STATE);
    expect(actualNewSchoolDetail.zip).toBe(EXPECTED_ZIP);
    expect(actualNewSchoolDetail.type).toBe(EXPECTED_TYPE);
    expect(actualNewSchoolDetail.phone).toBe(EXPECTED_PHONE);
    expect(actualNewSchoolDetail.url).toBe(EXPECTED_URL);
    expect(actualNewSchoolDetail.userId).toBe(
      EXPECTED_NEW_SCHOOLDETAIL_USER_ID
    );
  });
});

describe('addSchoolDetail GQL mutation error handling: ', () => {
  const EXPECTED_NAME = 'Test School';
  const EXPECTED_TAX_ID = '40-4040404';
  const EXPECTED_PHONE = '404-404-0404';
  const EXPECTED_URL = 'anavela.bolnamber.nt.fnd';
  const EXPECTED_NEW_SCHOOLDETAIL_USER_ID = USER_COUNT;

  test('• when "name" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please add a name for the new school.';

    const MUTATION = `
      mutation {
        addSchoolDetail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "taxId" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please add a tax ID for the new school.';

    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXPECTED_NAME}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "phone" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Please add a phone number for the new school.';

    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXPECTED_NAME}"
          taxId:" ${EXPECTED_TAX_ID}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "url" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Please add the URL of the new school.';

    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXPECTED_NAME}"
          taxId: "${EXPECTED_TAX_ID}"
          phone: "${EXPECTED_PHONE}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when "userId" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Please add an available user ID to assign to the new school.';

    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXPECTED_NAME}"
          taxId: "${EXPECTED_TAX_ID}"
          phone: "${EXPECTED_PHONE}"
          url: "${EXPECTED_URL}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided user ID does not belong to an existing user', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'The provided user ID does not correspond to any existing user.';

    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXPECTED_NAME}"
          taxId: "${EXPECTED_TAX_ID}"
          phone: "${EXPECTED_PHONE}"
          url: "${EXPECTED_URL}"
          userId: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided school name is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = 'School name must be unique.';

    // Should be based on current seed data
    const EXISTING_NAME = 'School of the East';
    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXISTING_NAME}"
          taxID: "${EXPECTED_TAX_ID}"
          phone: "${EXPECTED_PHONE}"
          url: "${EXPECTED_URL}"
          userId: ${EXPECTED_NEW_SCHOOLDETAIL_USER_ID}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).isNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided tax ID is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Tax ID must be unique';

    // Should be based on current seed data
    const EXISTING_TAX_ID = '000000000';
    const MUTATION = `
      mutation {
        addSchoolDetail (
          name: "${EXPECTED_NAME}"
          taxID: "${EXISTING_TAX_ID}"
          phone: "${EXPECTED_PHONE}"
          url: "${EXPECTED_URL}"
          userId: ${EXPECTED_NEW_SCHOOLDETAIL_USER_ID}
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addSchoolDetail).isNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});

describe('updateSchoolDetail GQL mutation: ', () => {
  let expectedSchoolDetailsIdToUpdate; // school details entry to update for each updateSchoolDetail mutation test will be randomly selected among seed data
  const EXPECTED_UPDATED_NAME = 'Test School';
  const EXPECTED_UPDATED_TAX_ID = '40-4040404';
  const EXPECTED_UPDATED_STREET1 = '404 St.';
  const EXPECTED_UPDATED_STREET2 = 'Forohfor Town';
  const EXPECTED_UPDATED_CITY = 'Lost City';
  const EXPECTED_UPDATED_STATE = 'HA';
  const EXPECTED_UPDATED_ZIP = '40404';
  const EXPECTED_UPDATED_TYPE = 'testing';
  const EXPECTED_UPDATED_PHONE = '404-404-0404';
  const EXPECTED_UPDATED_URL = 'anavela.bolnamber.nt.fnd';
  const EXPECTED_UPDATED_SCHOOLDETAIL_USER_ID = USER_COUNT;

  beforeEach(() => {
    // Randomly generate valid test ID's before each test
    expectedSchoolDetailsIdToUpdate = Math.ceil(
      Math.random() * SCHOOLDETAIL_COUNT
    );
  });

  // The mutation string below will be reused for this group of tests
  const updateSchoolDetailMutationWithSchoolDetailId = id => `
    mutation {
      updateSchoolDetail(
        id: ${id}
        name: "${EXPECTED_UPDATED_NAME}"
        taxId: "${EXPECTED_UPDATED_TAX_ID}"
        street1: "${EXPECTED_UPDATED_STREET1}"
        street2: "${EXPECTED_UPDATED_STREET2}"
        city: "${EXPECTED_UPDATED_CITY}"
        state: "${EXPECTED_UPDATED_STATE}"
        zip: "${EXPECTED_UPDATED_ZIP}"
        type: "${EXPECTED_UPDATED_TYPE}"
        phone: "${EXPECTED_UPDATED_PHONE}"
        url: "${EXPECTED_UPDATED_URL}"
        userId: ${EXPECTED_UPDATED_SCHOOLDETAIL_USER_ID}
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

  it('• should return the expected data when updating information for a school details entry', async () => {
    const res = await graphql(
      schema,
      updateSchoolDetailMutationWithSchoolDetailId(
        expectedSchoolDetailsIdToUpdate
      ),
      null
    );
    const actual = res.data.updateSchoolDetail;

    expect(actual.id).toBe(expectedSchoolDetailsIdToUpdate.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.name).toBe(EXPECTED_UPDATED_NAME);
    expect(actual.taxId).toBe(EXPECTED_UPDATED_TAX_ID);
    expect(actual.street1).toBe(EXPECTED_UPDATED_STREET1);
    expect(actual.street2).toBe(EXPECTED_UPDATED_STREET2);
    expect(actual.city).toBe(EXPECTED_UPDATED_CITY);
    expect(actual.state).toBe(EXPECTED_UPDATED_STATE);
    expect(actual.zip).toBe(EXPECTED_UPDATED_ZIP);
    expect(actual.type).toBe(EXPECTED_UPDATED_TYPE);
    expect(actual.phone).toBe(EXPECTED_UPDATED_PHONE);
    expect(actual.url).toBe(EXPECTED_UPDATED_URL);
    expect(actual.userId).toBe(
      EXPECTED_UPDATED_SCHOOLDETAIL_USER_ID.toString()
    ); // the GraphQL response object will have String-type ID's
  });

  it('• should actually update the corresponding information for a school details entry in the database', async () => {
    // Initial mutation to update the school
    await graphql(
      schema,
      updateSchoolDetailMutationWithSchoolDetailId(
        expectedSchoolDetailsIdToUpdate
      ),
      null
    );

    const actualUpdatedSchoolDetail = await dbHelper.findById(
      // DB helper method to find the updated school details entry by ID
      expectedSchoolDetailsIdToUpdate
    );
    expect(actualUpdatedSchoolDetail.id).toBe(expectedSchoolDetailsIdToUpdate);
    expect(actualUpdatedSchoolDetail.name).toBe(EXPECTED_UPDATED_NAME);
    expect(actualUpdatedSchoolDetail.taxId).toBe(EXPECTED_UPDATED_TAX_ID);
    expect(actualUpdatedSchoolDetail.street1).toBe(EXPECTED_UPDATED_STREET1);
    expect(actualUpdatedSchoolDetail.street2).toBe(EXPECTED_UPDATED_STREET2);
    expect(actualUpdatedSchoolDetail.city).toBe(EXPECTED_UPDATED_CITY);
    expect(actualUpdatedSchoolDetail.state).toBe(EXPECTED_UPDATED_STATE);
    expect(actualUpdatedSchoolDetail.zip).toBe(EXPECTED_UPDATED_ZIP);
    expect(actualUpdatedSchoolDetail.type).toBe(EXPECTED_UPDATED_TYPE);
    expect(actualUpdatedSchoolDetail.phone).toBe(EXPECTED_UPDATED_PHONE);
    expect(actualUpdatedSchoolDetail.url).toBe(EXPECTED_UPDATED_URL);
    expect(actualUpdatedSchoolDetail.userId).toBe(
      EXPECTED_UPDATED_SCHOOLDETAIL_USER_ID
    );
  });
});

describe('updateSchoolDetail GQL mutation error handling: ', () => {
  test('• when "id" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Please include a school details entry ID and try again.';

    const MUTATION = `
      mutation {
        updateSchoolDetail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.updateSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when attempting to update a non-existent school details entry', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'School details entry with the given ID not found';

    const MUTATION = `
      mutation {
        updateSchoolDetail (
          id: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.updateSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided user ID does not belong to an existing user', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'The provided user ID does not correspond to any existing user.';

    const MUTATION = `
      mutation {
        updateSchoolDetail (
          id: 1
          userId: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.updateSchoolDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided school name is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = 'School name must be unique.';

    // Should be based on current seed data
    const TEST_ID_TO_UPDATE = 1;
    const EXISTING_NAME = 'School of the East';
    const MUTATION = `
      mutation {
        updateSchoolDetail (
          id: ${TEST_ID_TO_UPDATE}
          name: "${EXISTING_NAME}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.updateSchoolDetail).isNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided tax ID is not unique', async () => {
    const EXPECTED_ERROR_MESSAGE = 'Tax ID must be unique.';

    // Should be based on current seed data
    const TEST_ID_TO_UPDATE = 1;
    const EXISTING_TAX_ID = '000000001';
    const MUTATION = `
      mutation {
        updateSchoolDetail (
          id: ${TEST_ID_TO_UPDATE}
          taxId: "${EXISTING_TAX_ID}"
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.updateSchoolDetail).isNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});
