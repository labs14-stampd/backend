const graphql = require('graphql');
const User = require('../models/userModel.js');
const Schools = require('../models/schoolModel.js');
const Credentials = require('../models/credentialModel.js');
const { UserType, SchoolDetailsType, CredentialType } = require('./types.js');
const { txFunc, web3, contract } = require('../web3/web3.js');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      description: 'Gets all users',
      resolve: async () => {
        try {
          const res = await User.find();
          if (res) {
            return res;
          }
          return new Error('The users could not be found.');
        } catch {
          return new Error('There was an error completing your request.');
        }
      }
    },
    getUserById: {
      type: UserType,
      description: 'Gets a user by user ID',
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: async (parent, args) => {
        if (!args.id) {
          return new Error('Please include a user ID and try again.');
        }

        try {
          const res = await User.findById(args.id);
          if (res) {
            return res;
          }
          return new Error('The user could not be found.');
        } catch {
          return new Error('There was an error completing your request.');
        }
      }
    },
    getAllSchoolDetails: {
      type: new GraphQLList(SchoolDetailsType),
      description: 'Gets all schools',
      resolve: async () => {
        try {
          const res = await Schools.find();
          if (res.length) {
            return res;
          }
          return new Error('No schools could be found.');
        } catch {
          return new Error('There was an error completing your request.');
        }
      }
    },
    getSchoolDetailsBySchoolId: {
      type: SchoolDetailsType,
      description: 'Gets school by school ID',
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: async (parent, args) => {
        if (!args.id) {
          return new Error('Please include a school details ID and try again.');
        }

        try {
          const res = await Schools.findById(args.id);
          if (res) {
            return res;
          }
          return new Error('School details could not be found.');
        } catch {
          return new Error('there was an error completing your request.');
        }
      }
    },
    getAllCredentials: {
      type: new GraphQLList(CredentialType),
      description: 'Gets all credentials',
      resolve: async () => {
        try {
          const res = await Credentials.find();
          if (res.length) {
            return res;
          }
          return new Error('No credentials could be found');
        } catch {
          return new Error('there was an error completing your request.');
        }
      }
    },
    getCredentialById: {
      type: CredentialType,
      description: 'Get a credential by ID',
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: async (parent, args) => {
        if (!args.id) {
          return new Error('Please include a credential ID and try again.');
        }

        try {
          const res = await Credentials.findById(args.id);
          if (res) {
            return res;
          }
          return new Error('Credential with that ID could not be found');
        } catch {
          return new Error('there was an error completing your request.');
        }
      }
    },
    getCredentialsBySchoolId: {
      type: new GraphQLList(CredentialType),
      description: 'Get all of a schools credentials',
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: async (parent, args) => {
        if (!args.id) {
          return new Error('Please include a school ID and try again.');
        }

        try {
          const school = await User.findById(args.id);
          if (!school) {
            return new Error('School with that ID could not be found');
          }

          const res = await Credentials.findBy({
            schoolId: args.id
          });
          if (res) {
            return res;
          }
          return new Error('School with that ID could not be found');
        } catch {
          return new Error('there was an error completing your request.');
        }
      }
    },
    getCredentialsByEmail: {
      type: new GraphQLList(CredentialType),
      description: 'Get all credentials associated with a specific email',
      args: { email: { type: GraphQLString } },
      resolve: async (parent, args) => {
        if (!args.email) {
          return new Error('Please include an email address and try again.');
        }

        try {
          const res = await Credentials.findBy({ studentEmail: args.email });
          return res;
        } catch {
          return new Error('there was an error completing your request.');
        }
      }
    },
    verifyCredential: {
      type: CredentialType,
      description: 'Checks that a credential exists and is currently valid',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique ID of the credential to be validated'
        }
      },
      resolve: async (parent, args) => {
        try {
          const {
            id,
            txHash,
            valid,
            expirationDate,
            created_at,
            updated_at,
            ...cred
          } = await Credentials.findById(args.id);

          //data will be true or false, depending on validity of credential
          const data = await contract.methods
            .verifyCredential(cred.credHash)
            .call();
        } catch (error) {
          return error;
        }
      }
    }
  } // fields
});

module.exports = {
  RootQuery
};
