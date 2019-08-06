const graphql = require('graphql');
const User = require('../models/userModel.js');
const Schools = require('../models/schoolModel.js');
const Credentials = require('../models/credentialModel.js');
const { UserType, SchoolDetailsType, CredentialType } = require('./types.js');

const { GraphQLObjectType, GraphQLList, GraphQLID } = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      description: 'Gets all users',
      resolve() {
        return User.find()
          .then(res => {
            if (res) {
              return res;
            }
            return new Error('The users could not be found.');
          })
          .catch(() => {
            return new Error('There was an error completing your request.');
          });
      }
    },
    getUserById: {
      type: UserType,
      description: 'Gets a user by user ID',
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        if (!args.id) {
          return new Error('Please include a user ID and try again.');
        }
        return User.findById(args.id)
          .then(res => {
            if (res) {
              return res;
            }
            return new Error('The user could not be found.');
          })
          .catch(() => {
            return new Error('There was an error completing your request.');
          });
      }
    },
    getAllSchoolDetails: {
      type: new GraphQLList(SchoolDetailsType),
      description: 'Gets all schools',
      resolve() {
        return Schools.find()
          .then(res => {
            if (res.length) {
              return res;
            }
            return new Error('No schools could be found.');
          })
          .catch(() => {
            return new Error('There was an error completing your request.');
          });
      }
    },
    getSchoolDetailsBySchoolId: {
      type: SchoolDetailsType,
      description: 'Gets school by school ID',
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Schools.findById(args.id)
          .then(res => res)
          .catch(() => {
            return new Error('there was an error completing your request.');
          });
      }
    },
    getAllCredentials: {
      type: new GraphQLList(CredentialType),
      description: 'Gets all credentials',
      resolve() {
        return Credentials.find()
          .then(res => {
            if (res.length) {
              return res;
            }
            return new Error('No credentials could be found');
          })
          .catch(() => {
            return new Error('there was an error completing your request.');
          });
      }
    },
    getCredentialById: {
      type: CredentialType,
      description: 'Get a credential by ID',
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Credentials.findById(args.id)
          .then(res => {
            if (res) {
              return res;
            }
            return new Error('Credential with that ID could not be found');
          })
          .catch(() => {
            return new Error('there was an error completing your request.');
          });
      }
    },
    getCredentialsBySchoolId: {
      type: new GraphQLList(CredentialType),
      description: 'Get all of a schools credentials',
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Credentials.findBy({ schoolId: args.id })
          .then(res => res)
          .catch(() => {
            return new Error('there was an error completing your request.');
          });
      }
    }
  } // fields
});

module.exports = {
  RootQuery
};
