const db = require('../database/dbConfig.js');

function find() {
  return db('users');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

function findByUsername(username) {
  return db('users')
    .where({ username })
    .first();
}

async function insert(creds) {
  const [id] = await db('users').insert(creds, 'id');
  return findById(id);
}

async function update(id, changes) {
  await db('users')
    .where({ id })
    .update(changes);
  return findById(id);
}

function remove(id) {
  return db('users')
    .where({ id })
    .del();
}

module.exports = {
  find,
  findById,
  findBy,
  findByUsername,
  insert,
  update,
  remove
};
