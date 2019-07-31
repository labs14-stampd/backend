const graphql = require('graphql');
const Users = require('../models/userModel.js');
const Roles = require('../models/roleModel.js');
const Schools = require('../models/schoolModel.js');
const Credentials = require('../models/credentialModel.js');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = graphql;

const RoleType = new GraphQLObjectType({
  name: 'Role',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the role' },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique username of the user'
    },
    users: {
      type: new GraphQLList(UserType),
      description: 'Returns all users of specific role',
      resolve(parent) {
        return Users.findBy({ roleId: parent.id });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the user' },
    username: {
      type: GraphQLString,
      description: 'The unique username of the user'
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique email of the user'
    },
    roleId: {
      type: GraphQLID,
      description: 'The id for the role of the user'
    },
    role: {
      type: RoleType,
      description: 'The role associated with the user',
      resolve(parent) {
        return Roles.findById(parent.roleId);
      }
    },
    schoolDetails: {
      type: SchoolDetailsType,
      description: 'The school details associated with the user',
      resolve(parent) {
        return Schools.findByUserId(parent.id);
      }
    }
  })
});

const SchoolDetailsType = new GraphQLObjectType({
  name: 'SchoolDetails',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the school' },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique name of the school'
    },
    taxId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique tax ID of the school'
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
    type: { type: GraphQLString, description: 'The type of the school' },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The phone number of the school'
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The website url of the school'
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The ID of the user associated with the school'
    },
    user: {
      type: UserType,
      description: 'The user associated with the school',
      resolve(parent) {
        return Users.findById(parent.userId);
      }
    },
    credentials: {
      type: new GraphQLList(CredentialType),
      description: 'The credentials associated with the school',
      resolve(parent) {
        return Credentials.findBySchoolId(parent.userId);
        // This is the user ID of the corresponding school account
      }
    }
  })
});

const CredentialType = new GraphQLObjectType({
  name: 'Credential',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of a credentail' },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the credential'
    },
    description: {
      type: GraphQLString,
      description: 'Description of the credential'
    },
    txHash: {
      type: GraphQLString,
      description: 'Ethereum transaction hash for the credential'
    },
    type: { type: GraphQLString, description: 'Type of credential' },

    studentEmail: {
      type: GraphQLString,
      description: 'Student email associated with credential'
    },
    imageUrl: {
      type: GraphQLString,
      description: 'Image URL associated with credential'
    },
    criteria: {
      type: GraphQLString,
      description: 'Criteria required to complete credential'
    },
    issuedOn: {
      type: GraphQLString,
      description: 'Date credential was issued'
    },
    schoolId: {
      type: GraphQLID,
      description: 'USER id associated with the school issuing the credential'
      // ^^^ This is the id in the 'users' table
    },
    schoolsUserInfo: {
      type: UserType,
      description: 'The user associated with the school',
      resolve(parent) {
        return Users.findById(parent.schoolId);
      }
    }
  })
});

module.exports = {
  UserType,
  RoleType,
  SchoolDetailsType,
  CredentialType
};
