exports.up = function createRoles(knex) {
  return knex.schema.createTable('roles', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('type', 128);
  });
};

exports.down = function dropRoles(knex) {
  return knex.schema.dropTableIfExists('roles');
};
