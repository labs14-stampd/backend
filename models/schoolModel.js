const db = require('../database/dbConfig.js');

module.exports = {
  find,
  findBy,
  findById,
  findByUserId,
  insert,
  update,
  remove
};

function find() {
  return db('schoolDetails');
}

function findBy(filter) {
  return db('schoolDetails').where(filter);
}

function findById(id) {
  return db('schoolDetails')
    .where({ id })
    .first();
}

function findByUserId(userId) {
  return db('schoolDetails')
    .where({ userId })
    .first();
}

function insert(creds) {
  return db('schoolDetails').insert(creds);
}

async function update(id, changes) {
  await db('schoolDetails')
    .where({ id })
    .update(changes);
  return findById(id);
}

function remove(id) {
  return db('schoolDetails')
    .where({ id })
    .del();
}
