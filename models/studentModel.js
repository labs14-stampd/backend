const db = require('../database/dbConfig.js');

function find() {
  return db('studenDetails');
}

function findBy(filter) {
  return db('studenDetails').where(filter);
}

function findById(id) {
  return db('studenDetails')
    .where({ id })
    .first();
}

function findByUserId(userId) {
  return db('studenDetails')
    .where({ userId })
    .first();
}

async function insert(creds) {
  const [id] = await db('studenDetails').insert(creds, 'id');
  return findById(id);
}

async function update(id, changes) {
  await db('studenDetails')
    .where({ id })
    .update(changes);
  return findById(id);
}

function remove(id) {
  return db('studenDetails')
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
