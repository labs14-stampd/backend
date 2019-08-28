const db = require('../database/dbConfig.js');

function find() {
  return db('deletedCredentials');
}

function findBy(filter) {
  return db('deletedCredentials').where(filter);
}

function findById(id) {
  return db('deletedCredentialsdeletedCredentials')
    .where({ id })
    .first();
}

function findBySchoolId(schoolId) {
  return db('deletedCredentials').where({ schoolId });
}

async function insert(credential) {
  const [id] = await db('deletedCredentials').insert(credential, 'id');
  return findById(id);
}

module.exports = {
  find,
  findBy,
  findById,
  findBySchoolId,
  insert
};
