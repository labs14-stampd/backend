exports.up = function createSchoolDetails(knex) {
  return knex.schema.createTable('userEmails', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('email').notNullable();
    tbl
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNull()
      .unique();
    tbl.bool('verified').defaultTo(false);
  });
};

exports.down = function dropSchoolDetails(knex) {
  return knex.schema.dropTable('userEmails');
};