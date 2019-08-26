exports.up = async knex => {
  await knex.schema.createTable('roles', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('type', 128);
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('roles');
};
