exports.up = function(knex) {
  return knex.schema.createTable('credentials', tbl => {
    tbl.increments('id');
    tbl.string('name', 256).notNull();
    tbl.text('description');
    tbl.string('txHash', 64);
    tbl.string('type', 128);
    tbl.string('studentEmail', 128);
    tbl.string('imageUrl', 256);
    tbl.text('criteria');
    tbl.string('issuedOn', 128);
    tbl.timestamps(true, true);
    tbl
      .integer('schoolId')
      .unsigned()
      .references('id')
      .inTable('user'); // Need to reference id in "users" => schoolDetails
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('credentials');
};
