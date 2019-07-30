exports.seed = function(knex) {
  return knex('roles')
    .truncate()
    .then(function() {
      return knex('roles').insert([
        { id: 1, type: 'admin' },
        { id: 2, type: 'school' },
        { id: 3, type: 'student' },
        { id: 4, type: 'employer' }
      ]);
    });
};
