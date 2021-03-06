const graphql = require('graphql');
const Student = require('../../models/studentModel');
const Users = require('../../models/userModel.js');
const { StudentDetailsType } = require('../types.js');
const jwt = require('../../api/tokenService');

const { GraphQLString, GraphQLNonNull, GraphQLID } = graphql;

module.exports = {
  //* *********** Student Details ************/
  addStudentDetail: {
    type: StudentDetailsType,
    description: 'Adds school details to an existing user',
    args: {
      fullName: {
        type: GraphQLString,
        description: 'The full name of the student'
      },
      firstName: {
        type: GraphQLString,
        description: 'The first name of the student'
      },
      lastName: {
        type: GraphQLString,
        description: 'The last name of the student'
      },
      middleName: {
        type: GraphQLString,
        description: 'The middle name of the student'
      },
      street1: {
        type: GraphQLString,
        description: "Street line 1 of the school's address"
      },
      street2: {
        type: GraphQLString,
        description: "Street line 2 of the school's address"
      },
      city: { type: GraphQLString, description: 'The city of the school' },
      state: { type: GraphQLString, description: 'The state of the school' },
      zip: { type: GraphQLString, description: 'The zip code of the school' },
      phone: {
        type: GraphQLString,
        description: 'The phone number of the school'
      },
      userId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of the user associated with the school'
      }
    },
    resolve: async (parent, args, ctx) => {
      if (!ctx.isAuth) {
        return new Error('Unauthorized');
      }

      try {
        const newStudent = await Student.insert(args);

        const user = await Users.findById(args.userId);
        const token = jwt({
          userId: newStudent.userId,
          email: user.email,
          roleId: user.roleId
        });

        return { ...newStudent, token };
      } catch (error) {
        return new Error('There was an error completing your request.');
      }
    }
  }, // Add School Detail
  updateStudentDetail: {
    type: StudentDetailsType,
    description: 'Updates school details for a user',
    args: {
      fullName: {
        type: GraphQLString,
        description: 'The full name of the student'
      },
      firstName: {
        type: GraphQLString,
        description: 'The first name of the student'
      },
      lastName: {
        type: GraphQLString,
        description: 'The last name of the student'
      },
      middleName: {
        type: GraphQLString,
        description: 'The middle name of the student'
      },
      street1: {
        type: GraphQLString,
        description: "Street line 1 of the Student's address"
      },
      street2: {
        type: GraphQLString,
        description: "Street line 2 of the Student's address"
      },
      city: { type: GraphQLString, description: 'The city of the Student' },
      state: { type: GraphQLString, description: 'The state of the Student' },
      zip: { type: GraphQLString, description: 'The zip code of the Student' },
      phone: {
        type: GraphQLString,
        description: 'The phone number of the Student'
      },
      userId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of the user associated with the Student'
      },
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of the student details'
      }
    },
    resolve: async (parent, args, ctx) => {
      if (Number(ctx.roleId) !== 3 && Number(ctx.roleId) !== 1) {
        return new Error('Unauthorized');
      }

      if (!args.id || typeof Number(args.id) !== 'number') {
        return new Error('Please include a StudentDetails ID and try again.');
      }

      try {
        const res = await Student.update(args.id, args);
        if (res) {
          return res;
        }
        return new Error('The School could not be updated.');
      } catch {
        return new Error('There was an error completing your request.');
      }
    }
  } // Update Student Detail
};
