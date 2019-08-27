const jwt = require('../../api/tokenService');

const Student = require('../../models/studentModel');
const Users = require('../../models/userModel.js');

const { StudentDetailsType } = require('../types.js');
const errorTypes = require('../errors');
const { GraphQLString, GraphQLID } = require('graphql');

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
        type: GraphQLID,
        description: 'The ID of the user associated with the school'
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (!ctx || !ctx.isAuth) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When user ID parameter is missing
      if (!args.userId) {
        return new Error(errorTypes.MISSING_PARAMETER.USER.ID);
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
        if (error.code === '23503') {
          // When a foreign key constraint is violated (ex.: using a nonexistent foreign key ID value), determine which foreign key value does not exist
          if (error.constraint === 'studentdetails_userid_foreign') {
            return new Error(errorTypes.NOT_FOUND.USER);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        }

        return new Error(errorTypes.GENERIC + error.message);
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
        type: GraphQLID,
        description: 'The ID of the user associated with the Student'
      },
      id: {
        type: GraphQLID,
        description: 'The ID of the student details'
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (!ctx || (Number(ctx.roleId) !== 3 && Number(ctx.roleId) !== 1)) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When ID parameter is missing
      if (!args.id) {
        return new Error(errorTypes.MISSING_PARAMETER.STUDENTDETAIL.ID);
      }

      try {
        const res = await Student.update(args.id, args);
        if (res) {
          return res;
        }
        return new Error(errorTypes.NOT_FOUND.STUDENTDETAIL);
      } catch (error) {
        if (error.code === '23503') {
          // When a foreign key constraint is violated (ex.: using a nonexistent foreign key ID value), determine which foreign key value does not exist
          if (error.constraint === 'studentdetails_userid_foreign') {
            return new Error(errorTypes.NOT_FOUND.USER);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        }

        return new Error(errorTypes.GENERIC + error.message);
      }
    }
  } // Update Student Detail
};
