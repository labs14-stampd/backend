const { graphql } = require('graphql');
const schema = require('../schema/schema');

describe("getAllUsers query: ", () => {
  it('• should return all user data from test seeds', async () => {
    const EXPECTED = {
      "data": {
        "getAllUsers": [
          {
            "id": "1",
            "username": "admin",
            "email": "teamstampd@gmail.com",
            "profilePicture": "",
            "roleId": "1",
            "sub": "1"
          },
          {
            "id": "2",
            "username": "admin2",
            "email": "stampdteam@gmail.com",
            "profilePicture": "",
            "roleId": "1",
            "sub": "2"
          },
          {
            "id": "3",
            "username": "school1",
            "email": "schoolzrus@rocketmail.com",
            "profilePicture": "",
            "roleId": "2",
            "sub": "3"
          },
          {
            "id": "4",
            "username": "school2",
            "email": "surzloohcs@hotmail.com",
            "profilePicture": "",
            "roleId": "2",
            "sub": "4"
          },
          {
            "id": "5",
            "username": "school3",
            "email": "school@school.edu",
            "profilePicture": "",
            "roleId": "2",
            "sub": "5"
          },
          {
            "id": "6",
            "username": "student1",
            "email": "stud1@yahoo.com",
            "profilePicture": "",
            "roleId": "3",
            "sub": "6"
          },
          {
            "id": "7",
            "username": "student2",
            "email": "stud2@icloud.com",
            "profilePicture": "",
            "roleId": "3",
            "sub": "7"
          },
          {
            "id": "8",
            "username": "student3",
            "email": "notadud@yandex.com",
            "profilePicture": "",
            "roleId": "3",
            "sub": "8"
          }
        ]
      }
    };
    const QUERY = `
      query {
        getAllUsers {
          id
          username
          email
          profilePicture
          roleId
          sub
        }
      }
    `;

    const actual = await graphql(schema, QUERY, null);
    expect(EXPECTED).toEqual(actual);
  })

  it('• should have matching role ID\'s in both roleId and role properties', async () => {
    const QUERY = `
      query {
        getAllUsers {
          roleId
          role {
            id
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getAllUsers.forEach(user => {
      expect(user.roleId).toEqual(user.role.id);
    });
  });

  it ('• should have null value for schoolDetails property if user is not a school', async () => {
    const QUERY = `
      query {
        getAllUsers {
          roleId
          role {
            id
          }
          schoolDetails {
            userId
          }
        }
      }
    `;

    const res = await graphql(schema, QUERY, null);
    res.data.getAllUsers.forEach(user => {
      if (user.roleId != '2' && user.role.id != '2') {
        expect(user.schoolDetails).toBeNull();
      }
    });
  });
});