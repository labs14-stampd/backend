exports.up = async knex => {
  await knex.schema.createTable('users', tbl => {
    tbl
      .increments('id')
      .unsigned()
      .primary();
    tbl.string('username', 256).unique();
    tbl
      .string('email', 128)
      .unique()
      .notNull();
    tbl.string('profilePicture', 256);
    tbl
      .string('sub', 128)
      .notNull()
      .unique();
    tbl
      .integer('roleId')
      .unsigned()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('users');
};
