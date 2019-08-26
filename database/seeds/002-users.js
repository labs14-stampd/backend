exports.seed = async knex => {
  await knex('users').insert([
    {
      // id: 1,
      username: 'admin',
      email: 'schoolzrus@rocketmail.com',
      profilePicture: '',
      sub: '1',
      roleId: 2
    },
    {
      // id: 2,
      username: 'admin2',
      email: 'stampdteam@gmail.com',
      profilePicture: '',
      sub: '2',
      roleId: 1
    },
    // These are the school accounts
    {
      // id: 3,
      username: 'school1',
      email: 'teamstampd@gmail.com',
      profilePicture: '',
      sub: '3',
      roleId: 2
    },
    {
      // id: 4,
      username: 'school2',
      email: 'surzloohcs@hotmail.com',
      profilePicture: '',
      sub: '4',
      roleId: 2
    },
    {
      // id: 5,
      username: 'school3',
      email: 'school@school.edu',
      profilePicture: '',
      sub: '5',
      roleId: 2
    },
    // These are the student accounts
    {
      // id: 6,
      username: 'student1',
      email: 'stud1@yahoo.com',
      profilePicture: '',
      sub: '6',
      roleId: 3
    },
    {
      // id: 7,
      username: 'student2',
      email: 'stud2@icloud.com',
      profilePicture: '',
      sub: '7',
      roleId: 3
    },
    {
      // id: 8,
      username: 'student3',
      email: 'notadud@yandex.com',
      profilePicture: '',
      sub: '8',
      roleId: 3
    },
    {
      // id: 9,
      username: 'test_school',
      email: 'skollboii@studytest.edu',
      profilePicture: '',
      sub: '9',
      roleId: 2
    }
  ]);
};
