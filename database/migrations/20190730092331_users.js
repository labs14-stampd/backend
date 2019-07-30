exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increment();
    tbl.string('username', 256).notNull();
    tbl.string('email', 256).notNull();
    tbl
      .integer('roleId')
      .unsigned()
      .references('id')
      .inTable('roles')
      .notNull();
    tbl.unique('username', 'uq_users_username');
    tbl.unique('email', 'uq_users_email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
