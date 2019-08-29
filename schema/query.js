const secret = process.env.PK;

const jwt = require('jsonwebtoken');
const { contract } = require('../web3/web3.js');
const { sendMagicLink } = require('../utils/sendMail.js');

const User = require('../models/userModel.js');
const Schools = require('../models/schoolModel.js');
const Credentials = require('../models/credentialModel.js');

const { UserType, SchoolDetailsType, CredentialType } = require('./types.js');
const errorTypes = require('./errors.js');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString
} = require('graphql');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      description: 'Gets all users',
      resolve: async (parent, args, ctx) => {
        // Authorization check
        if (!ctx || Number(ctx.roleId) !== 1) {
          // Also account for missing context to ensure error handling for unauthenticated users
          return new Error(errorTypes.UNAUTHORIZED);
        }

        try {
          const res = await User.find();
          return res;
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }
    },
    getUserById: {
      type: UserType,
      description: 'Gets a user by user ID',
      args: {
        id: {
          type: GraphQLID,
          description: 'ID of the user'
        }
      },
      resolve: async (parent, args, ctx) => {
        // Authorization check
        if (!ctx || !ctx.isAuth) {
          // Also account for missing context to ensure error handling for unauthenticated users
          return new Error(errorTypes.UNAUTHORIZED);
        }

        // When ID parameter is missing
        if (!args.id) {
          return new Error(errorTypes.MISSING_PARAMETER.USER.ID);
        }

        // When data input type of ID parameter is incorrect (not a number)
        if (isNaN(args.id)) {
          return new Error(errorTypes.TYPE_MISMATCH.USER.ID);
        }

        try {
          const res = await User.findById(args.id);
          if (res) {
            return res;
          }
          return new Error(errorTypes.NOT_FOUND.USER);
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
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
      resolve: async (parent, args, ctx) => {
        // Authorization check
        if (!ctx || Number(ctx.roleId) !== 2) {
          // Also account for missing context to ensure error handling for unauthenticated users
          return new Error(errorTypes.UNAUTHORIZED);
        }

        // When ID parameter is missing
        if (!args.id) {
          return new Error(errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.ID);
        }

        // When data input type of ID parameter is incorrect (not a number)
        if (isNaN(args.id)) {
          return new Error(errorTypes.TYPE_MISMATCH.SCHOOLDETAIL.ID);
        }

        try {
          const res = await Schools.findById(args.id);
          if (res) {
            return res;
          }
          return new Error(errorTypes.NOT_FOUND.SCHOOLDETAIL);
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }
    },
    getAllCredentials: {
      type: new GraphQLList(CredentialType),
      description: 'Gets all credentials',
      resolve: async (parent, args, ctx) => {
        // Authorization check
        if (!ctx || Number(ctx.roleId) !== 1) {
          // Also account for missing context to ensure error handling for unauthenticated users
          return new Error(errorTypes.UNAUTHORIZED);
        }

        try {
          const res = await Credentials.find();
          return res;
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
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
        // When ID parameter is missing
        if (!args.id) {
          return new Error(errorTypes.MISSING_PARAMETER.CREDENTIAL.ID);
        }

        // When data input type of ID parameter is incorrect (not a number)
        if (isNaN(args.id)) {
          return new Error(errorTypes.TYPE_MISMATCH.CREDENTIAL.ID);
        }

        try {
          const res = await Credentials.findById(args.id);
          if (res) {
            return res;
          }
          return new Error(errorTypes.NOT_FOUND.CREDENTIAL);
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
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
      resolve: async (parent, args, ctx) => {
        // Authorization check
        if (!ctx || (Number(ctx.roleId) !== 2 && Number(ctx.roleId) !== 1)) {
          // Also account for missing context to ensure error handling for unauthenticated users
          return new Error(errorTypes.UNAUTHORIZED);
        }

        // When ID parameter is missing
        if (!args.id) {
          return new Error(errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.ID);
        }

        // When data input type of ID parameter is incorrect (not a number)
        if (isNaN(args.id)) {
          return new Error(errorTypes.TYPE_MISMATCH.SCHOOLDETAIL.ID);
        }

        try {
          const school = await User.findById(args.id);
          if (!school) {
            return new Error(errorTypes.NOT_FOUND.SCHOOLDETAIL);
          }

          const res = await Credentials.findBy({
            schoolId: args.id
          });
          return res;
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }
    },
    getCredentialsByEmail: {
      type: new GraphQLList(CredentialType),
      description: 'Get all credentials associated with a specific email',
      args: { email: { type: GraphQLString } },
      resolve: async (parent, args, ctx) => {
        // Authorization check
        if (!ctx || (Number(ctx.roleId) !== 2 && Number(ctx.roleId) !== 1)) {
          // Also account for missing context to ensure error handling for unauthenticated users
          return new Error(errorTypes.UNAUTHORIZED);
        }

        // When email parameter is missing
        if (!args.email) {
          return new Error(errorTypes.MISSING_PARAMETER.EMAIL_ADDRESS);
        }

        try {
          const res = await Credentials.findBy({ studentEmail: args.email });
          return res;
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }
    },
    verifyCredential: {
      type: CredentialType,
      description: 'Checks that a credential exists and is currently valid',
      args: {
        id: {
          type: GraphQLID,
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
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }
    },
    shareCredential: {
      type: UserType,
      description: 'Creates and emails magic link to recipient',
      args: {
        id: {
          type: GraphQLID,
          description: 'The unique ID of the credential to be shared'
        },
        email: {
          type: GraphQLString,
          description: 'The email of the recipient of magic link'
        }
      },
      resolve: async (parent, args) => {
        try {
          credential = await Credentials.findById(args.id);

          const payload = {
            credId: credential.id
          };

          const options = { expiresIn: '45d' };

          const linkJwt = jwt.sign(payload, secret, options);
          sendMagicLink({
            recipientEmail: args.email,
            student: credential.ownerName,
            jwt: linkJwt
          });
          return { email: args.email };
        } catch (error) {
          return new Error(errorTypes.GENERIC);
        }
      }
    }
  } // fields
});

module.exports = {
  RootQuery
};
