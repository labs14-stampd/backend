const db = require('../database/dbConfig.js');

module.exports = {
  find,
  findBy,
  findById,
  findBySchoolId,
  insert,
  update
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

async function insert(credential) {
  const [id] = await db('credentials').insert(credential, 'id');
  return findById(id);
}

async function update(id, changes) {
  await db('credentials')
    .where({ id })
    .update(changes);
  return findById(id);
}
