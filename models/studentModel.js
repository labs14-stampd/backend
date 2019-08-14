const db = require('../database/dbConfig.js');

function find() {
  return db('studentDetails');
}

function findBy(filter) {
  return db('studentDetails').where(filter);
}

function findById(id) {
  return db('studentDetails')
    .where({ id })
    .first();
}

function findByUserId(userId) {
  return db('studentDetails')
    .where({ userId })
    .first();
}

async function insert(details) {
  console.log(details);
  const [id] = await db('studentDetails').insert(details, 'id');
  return findById(id);
}

async function update(id, changes) {
  await db('studentDetails')
    .where({ id })
    .update(changes);
  return findById(id);
}

function remove(id) {
  return db('studentDetails')
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
