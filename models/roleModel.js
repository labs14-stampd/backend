const db = require('../database/dbConfig.js');

function find() {
  return db('roles');
}

function findById(id) {
  return db('roles')
    .where({ id })
    .first();
}

module.exports = {
  find,
  findById
};
