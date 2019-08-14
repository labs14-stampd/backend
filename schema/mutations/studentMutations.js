const graphql = require('graphql');
const Student = require('../../models/studentModel');
const { StudentDetailsType } = require('../types.js');

const { GraphQLString, GraphQLNonNull, GraphQLID } = graphql;

module.exports = {
  //* *********** Student Details ************/
  addStudentDetail: {
    type: StudentDetailsType,
    description: 'Adds school details to an existing user',
    args: {
      id: { type: GraphQLID, description: 'The unique ID of the school' },
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
        type: new GraphQLNonNull(GraphQLString),
        description: 'The phone number of the school'
      },
      userId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of the user associated with the school'
      }
    },
    resolve(parent, args) {
      return Student.insert(args)
        .then(res => res)
        .catch(err => new Error(err));
    }
  }, // Add School Detail
  updateStudentDetail: {
    type: StudentDetailsType,
    description: 'Updates school details for a user',
    args: {
      id: { type: GraphQLID, description: 'The unique ID of the school' },
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
        type: new GraphQLNonNull(GraphQLString),
        description: 'The phone number of the school'
      },
      userId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of the user associated with the school'
      }
    },
    resolve(parent, args) {
      if (!args.id || typeof Number(args.id) !== 'number') {
        return new Error('Please include a SchoolDetails ID and try again.');
      }
      return Student.update(args.id, args)
        .then(res => {
          if (res) {
            return res;
          }
          return new Error('The School could not be updated.');
        })
        .catch(() => {
          return new Error('There was an error completing your request.');
        });
    }
  } // Update Student Detail
};
