const graphql = require('graphql');
const User = require('../models/userModel.js');
const { UserType } = require('./types.js');

const { GraphQLObjectType, GraphQLList, GraphQLID } = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      description: 'Gets all users',
      resolve(parent, args) {
        return User.find()
          .then(res => {
            if (res) {
              return res;
            } else {
              return new Error('The users could not be found.');
            }
          })
          .catch(err => {
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
        } else {
          return User.findById(args.id)
            .then(res => {
              if (res) {
                return res;
              } else {
                return new Error('The user could not be found.');
              }
            })
            .catch(err => {
              return new Error('There was an error completing your request.');
            });
        }
      }
    },
  }
});

module.exports = {
  RootQuery
};
