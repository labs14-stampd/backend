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

<<<<<<< HEAD
async function insert(creds) {
  const [id] = await db('studentDetails').insert(creds, 'id');
=======
async function insert(details) {
  const [id] = await db('studentDetails').insert(details, 'id');
>>>>>>> 239075d90ab007439ad6eb0c208d7104fefde100
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
