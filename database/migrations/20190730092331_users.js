exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('username', 256).unique();
    tbl
      .string('email', 128)
      .unique()
      .notNull();
    tbl
      .integer('roleId')
      .unsigned()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
