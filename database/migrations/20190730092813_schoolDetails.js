exports.up = function(knex) {
  return knex.schema.createTable('schoolDetails', tbl => {
    tbl.increments('id');
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
    tbl.string('url', 256).notNull();
    tbl
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNull();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('schoolDetails');
};
