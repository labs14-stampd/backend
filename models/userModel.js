const db = require('../database/dbConfig.js');

module.exports = {
  find,
  findById,
  findBy,
  findByUsername,
  insert,
  update,
  remove
};

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

function update(id, changes) {
  return db('users')
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db('users')
    .where({ id })
    .del();
}
