const { graphql } = require('graphql');
const schema = require('../schema/schema');
const db = require('../database/dbConfig');

const dbHelper = require('../model/schoolModel');

// Re-seed before all mutation tests and after each mutation test to ensure that each test will work with a clean set of data
const cleanUpSeeds = () => db.seed.run();
beforeAll(cleanUpSeeds);
afterEach(cleanUpSeeds);

