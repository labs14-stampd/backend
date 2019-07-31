exports.up = function(knex) {
  return knex.schema.createTable('roles', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('type', 128);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('roles');
};
