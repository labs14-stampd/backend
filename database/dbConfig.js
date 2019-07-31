const knex = require('knex');
require('dotenv').config();

const db = process.env.DB_ENV || 'development';
const knexConfig = require('../knexfile.js')[db];

module.exports = knex(knexConfig);
