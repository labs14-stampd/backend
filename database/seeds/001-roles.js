exports.seed = async knex => {
  /*
      Empty all dependent tables first to prevent violation of foreign key constraints, and reset sequences 
      to keep ID values consistent (always start the increments for all tables at 1).
   */

  await knex('credentials').del();
  await knex.raw('ALTER SEQUENCE credentials_id_seq RESTART WITH 1');

  await knex('schoolDetails').del();
  await knex.raw('ALTER SEQUENCE "schoolDetails_id_seq" RESTART WITH 1');

  await knex('studentDetails').del();
  await knex.raw('ALTER SEQUENCE "studentDetails_id_seq" RESTART WITH 1');

  await knex('userEmails').del();
  await knex.raw('ALTER SEQUENCE "userEmails_id_seq" RESTART WITH 1');

  await knex('users').del();
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  // Explicitly set specific ID values to ensure that they will always stay exactly the same
  await knex('roles').del();
  await knex('roles').insert([
    { id: 1, type: 'admin' },
    { id: 2, type: 'school' },
    { id: 3, type: 'student' },
    { id: 4, type: 'employer' }
  ]);
};
