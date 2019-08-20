const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');

const dbHelper = require('../models/studentModel');

beforeEach(async () => {
  // Re-seed before all mutation tests to ensure that each test will work with a clean set of data
  await db.seed.run();
});
afterAll(async () => {
  // Re-seed after all tests in this test suite to ensure that the next test suite will work with a clean set of data
  await db.seed.run();
  await db.destroy(); // Necessary to prevent connections from not closing (which could eventually clog the Postgres database if left unchecked)
});

// should be based on current seed data
const USER_COUNT = 9;
const STUDENTDETAIL_COUNT = 3;

describe('addStudentDetail GQL mutation: ', () => {
  const EXPECTED_NEW_STUDENTDETAIL_ID = STUDENTDETAIL_COUNT + 1;
  const EXPECTED_FULLNAME = 'John Doe';
  const EXPECTED_FIRSTNAME = 'John';
  const EXPECTED_LASTNAME = 'Doe';
  const EXPECTED_MIDDLENAME = 'X';
  const EXPECTED_STREET1 = '404 St.';
  const EXPECTED_STREET2 = 'Forohfor Town';
  const EXPECTED_CITY = 'Lost City';
  const EXPECTED_STATE = 'HA';
  const EXPECTED_ZIP = '40404';
  const EXPECTED_PHONE = '404-404-0404';
  const EXPECTED_NEW_STUDENTDETAIL_USER_ID = USER_COUNT;

  // The mutation string below will be reused for this group of tests
  const MUTATION = `
    mutation {
      addStudentDetail (
        fullName: "${EXPECTED_FULLNAME}"
        firstName: "${EXPECTED_FIRSTNAME}"
        lastName: "${EXPECTED_LASTNAME}"
        middleName: "${EXPECTED_MIDDLENAME}"
        street1: "${EXPECTED_STREET1}"
        street2: "${EXPECTED_STREET2}"
        city: "${EXPECTED_CITY}"
        state: "${EXPECTED_STATE}"
        zip: "${EXPECTED_ZIP}"
        phone: "${EXPECTED_PHONE}"
        userId: ${EXPECTED_NEW_STUDENTDETAIL_USER_ID}
      ) {
        id
        fullName
        firstName
        lastName
        middleName
        street1
        street2
        city
        state
        zip
        phone
        userId
      }
    }
  `;

  it('• should return the expected data when adding a student details entry', async () => {
    const res = await graphql(schema, MUTATION, null);
    const actual = res.data.addStudentDetail;

    expect(actual.id).toBe(EXPECTED_NEW_STUDENTDETAIL_ID.toString()); // the GraphQL response object will have String-type ID's
    expect(actual.fullName).toBe(EXPECTED_FULLNAME);
    expect(actual.firstName).toBe(EXPECTED_FIRSTNAME);
    expect(actual.lastName).toBe(EXPECTED_LASTNAME);
    expect(actual.middleName).toBe(EXPECTED_MIDDLENAME);
    expect(actual.street1).toBe(EXPECTED_STREET1);
    expect(actual.street2).toBe(EXPECTED_STREET2);
    expect(actual.city).toBe(EXPECTED_CITY);
    expect(actual.state).toBe(EXPECTED_STATE);
    expect(actual.zip).toBe(EXPECTED_ZIP);
    expect(actual.phone).toBe(EXPECTED_PHONE);
    expect(actual.userId).toBe(EXPECTED_NEW_STUDENTDETAIL_USER_ID.toString()); // the GraphQL response object will have String-type ID's
  });

  it('• should actually insert a new student details entry into the database', async () => {
    // Initial mutation to add the user
    await graphql(schema, MUTATION, null);

    const actualNewStudentDetail = await dbHelper.findById(
      EXPECTED_NEW_STUDENTDETAIL_ID
    );
    expect(actualNewStudentDetail.id).toBe(EXPECTED_NEW_STUDENTDETAIL_ID);
    expect(actualNewStudentDetail.fullName).toBe(EXPECTED_FULLNAME);
    expect(actualNewStudentDetail.firstName).toBe(EXPECTED_FIRSTNAME);
    expect(actualNewStudentDetail.lastName).toBe(EXPECTED_LASTNAME);
    expect(actualNewStudentDetail.middleName).toBe(EXPECTED_MIDDLENAME);
    expect(actualNewStudentDetail.street1).toBe(EXPECTED_STREET1);
    expect(actualNewStudentDetail.street2).toBe(EXPECTED_STREET2);
    expect(actualNewStudentDetail.city).toBe(EXPECTED_CITY);
    expect(actualNewStudentDetail.state).toBe(EXPECTED_STATE);
    expect(actualNewStudentDetail.zip).toBe(EXPECTED_ZIP);
    expect(actualNewStudentDetail.phone).toBe(EXPECTED_PHONE);
    expect(actualNewStudentDetail.userId).toBe(
      EXPECTED_NEW_STUDENTDETAIL_USER_ID
    );
  });
});

describe('addStudentDetail GQL mutation error handling: ', () => {
  test('• when "userId" parameter is missing', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'Please add an available user ID to assign to the new student.';

    const MUTATION = `
      mutation {
        addStudentDetail {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addStudentDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });

  test('• when provided user ID does not belong to an existing user', async () => {
    const EXPECTED_ERROR_MESSAGE =
      'The provided user ID does not correspond to any existing user.';

    const MUTATION = `
      mutation {
        addStudentDetail (
          userId: 0
        ) {
          id
        }
      }
    `;

    const res = await graphql(schema, MUTATION, null);
    expect(res.data.addStudentDetail).toBeNull();
    expect(res.errors[0].message).toBe(EXPECTED_ERROR_MESSAGE);
  });
});
