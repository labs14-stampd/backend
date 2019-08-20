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
const STUDENT_COUNT = 3;
