const db = require('../database/dbConfig.js');

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

async function insert(creds) {
  const [id] = await db('schoolDetails').insert(creds, 'id');
  return findById(id);
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

module.exports = {
  find,
  findBy,
  findById,
  findByUserId,
  insert,
  update,
  remove
};
