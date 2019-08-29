exports.up = async knex => {
  await knex.schema.createTable('studentDetails', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('firstName', 256);
    tbl.string('lastName', 256);
    tbl.string('middleName', 256);
    tbl.string('fullName', 256);
    tbl.string('street1', 256);
    tbl.string('street2', 256);
    tbl.string('city', 256);
    tbl.string('state', 50);
    tbl.string('zip', 128);
    tbl.string('phone', 256);
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
  await knex.schema.dropTable('studentDetails');
};
