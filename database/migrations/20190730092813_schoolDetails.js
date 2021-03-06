exports.up = async knex => {
  await knex.schema.createTable('schoolDetails', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl
      .string('name', 256)
      .unique()
      .notNull();
    tbl
      .string('taxId', 256)
      .unique()
      .notNull();
    tbl.string('street1', 256);
    tbl.string('street2', 256);
    tbl.string('city', 256);
    tbl.string('state', 50);
    tbl.string('zip', 128);
    tbl.string('type', 128);
    tbl.string('phone', 256).notNull();
    tbl.string('url', 256);
    tbl
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNull();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('schoolDetails');
};
