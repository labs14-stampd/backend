const graphql = require('graphql');
const jwt = require('../../api/tokenService.js');
const User = require('../../models/userModel.js');
const UserEmails = require('../../models/userEmailsModel');
const { UserType, UserEmailType } = require('../types.js');
const getDecoded = require('../../api/getDecoded.js');

const { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean } = graphql;

module.exports = {
  addUser: {
    type: UserType,
    description: 'Adds a new user',
    args: {
      authToken: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The unique Auth0 token of the new user'
      },
      roleId: {
        type: GraphQLID,
        description: 'The role associated with the new user'
      }
    },
    resolve(parent, args) {
      let token;
      const { authToken, ...restArgs } = args;
      const { sub, email, username, profilePicture } = getDecoded(authToken);
      return User.findBy({ email }).then(user => {
        if (user.sub && user.sub !== sub) {
          return new Error('You must be logged in with a valid account.');
        }
        if (user[0] && user[0].email) {
          token = jwt({
            userId: user[0].id,
            email: user[0].email,
            roleId: user[0].roleId
          });
          return {
            id: user[0].id,
            email: user[0].email,
            roleId: user[0].roleId,
            username: user[0].username,
            token
          };
        }
        return User.insert({
          sub,
          email,
          username,
          profilePicture,
          ...restArgs
        })
          .then(res => {
            token = jwt({
              userId: res.id,
              email: res.email,
              roleId: res.roleId
            });
            return {
              ...res,
              token
            };
          })
          .catch(err => new Error(err));
      });
    }
  }, // Add User
  updateUser: {
    type: UserType,
    description: 'Updates an existing user by user ID',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The unique ID of the user'
      },
      username: {
        type: GraphQLString,
        description: 'The new username of the user'
      },
      email: {
        type: GraphQLString,
        description: 'The new unique email of the user'
      },
      roleId: {
        type: GraphQLID,
        description: 'The new roleId of the user'
      }
    }, // Update User
    resolve(parent, args) {
      if (!args.id || typeof Number(args.id) !== 'number') {
        return new Error('Please include a user ID and try again.');
      }
      return User.update(args.id, args)
        .then(res => {
          if (res) {
            return User.findById(args.id)
              .then(response => response)
              .catch(() => {
                return new Error('There was an error completing your request.');
              });
          }
          return new Error('The user could not be updated.');
        })
        .catch(() => {
          return new Error('There was an error completing your request.');
        });
    }
  }, // Update User
  deleteUser: {
    type: UserType,
    description: 'Deletes an existing user by user ID',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The unique ID of the user to be deleted'
      }
    },
    resolve(parent, args) {
      if (!args.id || typeof Number(args.id) !== 'number') {
        return new Error('Please include a user ID and try again.');
      }
      return User.remove(args.id)
        .then(res => {
          if (res) {
            return { id: args.id };
          }
          return new Error('The user could not be deleted.');
        })
        .catch(err => ({ error: err }));
    }
  }, // Delete User
  addUserEmail: {
    type: UserEmailType,
    description: 'Adds additional emails to a user',
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The email of the user'
      },
      userId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'User the email belongs to.'
      },
      valid: {
        type: GraphQLBoolean,
        description: 'Boolean for whether email was verified.'
      }
    },
    resolve(parent, args) {
      return UserEmails.insert(args)
        .then(res => {
          return res;
        })
        .catch(err => {
          return { error: err, message: 'Unique constraint' };
        });
    }
  }, // Add user email
  deleteUserEmail: {
    type: UserEmailType,
    description: 'Deletes an email associated with a unique user',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The unique ID of the user to be deleted'
      }
    },
    resolve(parent, args) {
      if (!args.id || typeof Number(args.id) !== 'number') {
        return new Error('Please include a user ID and try again.');
      }
      return UserEmails.remove(args.id)
        .then(res => {
          if (res) {
            return { id: args.id };
          }
          return new Error('The email could not be deleted.');
        })
        .catch(err => ({ error: err }));
    }
  } // Delete User Email
};
