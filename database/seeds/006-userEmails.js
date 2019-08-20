exports.seed = function seedUsers(knex) {
  return knex('userEmails')
    .del()
    .then(() =>
      knex('userEmails').insert([
        {
          // id: 1,
          email: 'trufflin.waffles@gmail.com',
          userId: 1,
          valid: true
        },
        {
          // id: 2,
          email: 'cool_skool@educ.com',
          userId: 3,
          valid: false
        },
        {
          // id: 3,
          email: 'learners.learn@study.edu',
          userId: 3,
          valid: true
        },
        {
          // id: 4,
          email: 'studley@lulz.net',
          userId: 8,
          valid: false
        }
      ])
    );
};
