const graphql = require('graphql');
const Users = require('../models/userModel.js');
const Roles = require('../models/roleModel');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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
        return Users.findBy({roleId: parent.id})
      }
    }
  })
});

// const SchoolDetailsType = new GraphQLObjectType({});

// const CredentialsType = new GraphQLObjectType({});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the user' },
    username: {
      type: new GraphQLNonNull(GraphQLString),
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
      description: 'List of roles for a user',
      resolve(parent) {
        return Roles.findById(parent.roleId);
      }
    }
  })
});

module.exports = {
  UserType,
  RoleType
};

// firstName: {
//   type: GraphQLString,
//   description: 'The first name of the user'
// },
// middleName: {
//   type: GraphQLString,
//   description: 'The middle name of the user'
// },
// lastName: { type: GraphQLString, description: 'The last name of the user' },
// email: {
//   type: new GraphQLNonNull(GraphQLString),
//   description: 'The unique email of the user'
// },

// phone: { type: GraphQLString, description: 'The phone number of the user' },
// street1: {
//   type: GraphQLString,
//   description: "Street line 1 of the user's address"
// },
// street2: {
//   type: GraphQLString,
//   description: "Street line 2 of the user's address"
// },
// city: { type: GraphQLString, description: 'The city of the user' },
// state: { type: GraphQLString, description: 'The state of the user' },
// zip: { type: GraphQLString, description: 'The zip code of the user' },
