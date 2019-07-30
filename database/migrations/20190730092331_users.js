exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increment('id');
    tbl
      .string('username', 256)
      .unique()
      .notNull();
    tbl
      .string('email', 128)
      .unique()
      .notNull();
    tbl
      .integer('roleId')
      .unsigned()
      .references('id')
      .inTable('roles');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
