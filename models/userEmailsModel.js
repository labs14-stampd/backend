const db = require('../database/dbConfig.js');

function find() {
  return db('userEmails');
}

function findBy(filter) {
  return db('userEmails').where(filter);
}

function findById(id) {
  return db('userEmails')
    .where({ id })
    .first();
}

function findByUserId(userId) {
  return db('userEmails').where({ userId });
}

async function insert(creds) {
  const [id] = await db('userEmails').insert(creds, 'id');
  return findById(id);
}

async function update(id, changes) {
  await db('userEmails')
    .where({ id })
    .update(changes);
  return findById(id);
}

function remove(id) {
  return db('userEmails')
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
