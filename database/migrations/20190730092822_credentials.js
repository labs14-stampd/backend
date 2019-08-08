exports.up = function createCredentials(knex) {
  return knex.schema.createTable('credentials', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('name', 256).notNull();
    tbl.text('description').notNull();
    tbl.string('credHash', 66);
    tbl.string('txHash', 66);
    tbl.string('type', 128).notNull();
    tbl.string('studentEmail', 128).notNull();
    tbl.string('imageUrl', 256).notNull();
    tbl.bool('valid').defaultTo(true);
    tbl.text('criteria').notNull();
    tbl.string('issuedOn', 128).notNull();
    tbl.string('expirationDate', 128);
    tbl.timestamps(true, true);
    tbl
      .integer('schoolId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNull(); // Need to reference id in "users" => schoolDetails
  });
};

exports.down = function dropCredentials(knex) {
  return knex.schema.dropTable('credentials');
};
