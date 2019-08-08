const graphql = require('graphql');
const User = require('../models/userModel.js');
const Schools = require('../models/schoolModel.js');
const Credentials = require('../models/credentialModel.js');
const { UserType, SchoolDetailsType, CredentialType } = require('./types.js');
const { txFunc, web3, contract } = require('../web3/web3.js');


const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull} = graphql;

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
        if (!args.id) {
          return new Error('Please include a school details ID and try again.');
        }
        return Schools.findById(args.id)
          .then(res => {
            if (res) {
              return res;
            }
            return new Error('School details could not be found.');
          })
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
        if (!args.id) {
          return new Error('Please include a credential ID and try again.');
        }
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
      async resolve(parent, args) {
        if (!args.id) {
          return new Error('Please include a school ID and try again.');
        }
        const school = await User.findById(args.id);
        if (!school) {
          return new Error('School with that ID could not be found');
        }
        return Credentials.findBy({ schoolId: args.id })
          .then(res => {
            if (res) {
              return res;
            }
            return new Error('School with that ID could not be found');
          })
          .catch(() => {
            return new Error('there was an error completing your request.');
          });
      }
    }, 
    validateCredential:{
      type: CredentialType,
      description: 'Checks that a credential exists and is currently valid',
      args: {
        id:{
          type: new GraphQLNonNull(GraphQLID), 
          description: 'The unique ID of the credential to be validated'
        }
      },
      async resolve(parent, args){
        try{
          console.log('validate args', args)
          const {id,txHash,valid,expirationDate,created_at, updated_at, ...cred} = await Credentials.findById(args.id);
          cred.schoolId = cred.schoolId.toString();
          const credHash = web3.utils.sha3(JSON.stringify(cred));
          const data = await contract.methods.validateCredential(credHash).call();
          } catch(error){
          return error;
        }
      }
    }
  } // fields
});

module.exports = {
  RootQuery
};
