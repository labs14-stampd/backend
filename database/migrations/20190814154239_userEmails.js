exports.up = function createSchoolDetails(knex) {
  return knex.schema.createTable('userEmails', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl
      .string('email')
      .notNullable()
      .unique();
    tbl
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNull()
      .unique();
    tbl.boolean('valid').defaultTo(false);
  });
};

exports.down = function dropSchoolDetails(knex) {
  return knex.schema.dropTable('userEmails');
};
