exports.seed = async function(knex) {
  await knex('credentials').del();
  await knex.raw('ALTER SEQUENCE credentials_id_seq RESTART WITH 1')
  await knex('schoolDetails').del();
  await knex.raw('ALTER SEQUENCE "schoolDetails_id_seq" RESTART WITH 1')
  await knex('users').del();
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1')
  return knex('roles')
    .del()
    .then(function() {
      return knex('roles').insert([
        { id: 1, type: 'admin' },
        { id: 2, type: 'school' },
        { id: 3, type: 'student' },
        { id: 4, type: 'employer' }
      ]);
    });
};
