const db = require('../database/dbConfig.js');

module.exports = {
  find,
  findBy,
  findById,
  findBySchoolId
};

function find() {
  return db('credentials');
}

function findBy(filter) {
  return db('credentials').where(filter);
}

function findById(id) {
  return db('credentials')
    .where({ id })
    .first();
}

function findBySchoolId(schoolId) {
  return db('credentials').where({ schoolId });
}
