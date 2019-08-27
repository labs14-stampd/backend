require('dotenv').config();
const pg = require('pg');

pg.defaults.ssl = true;

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations',
      tablename: 'knex_migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    pool: {
      min: 2,
      max: 10
    },
    useNullAsDefault: true
  },
  testing: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
    migrations: {
      directory: './database/migrations',
      tablename: 'knex_migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    pool: {
      min: 2,
      max: 10
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './database/seeds'
    },
    useNullAsDefault: true
  }
};
