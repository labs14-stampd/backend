exports.up = async knex => {
  await knex.schema.createTable('userEmails', tbl => {
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
      .notNull();
    tbl.boolean('valid').defaultTo(false);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('userEmails');
};
