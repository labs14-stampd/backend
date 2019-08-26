const graphql = require('graphql');
const jwt = require('../../api/tokenService.js');
const User = require('../../models/userModel.js');
const UserEmails = require('../../models/userEmailsModel');
const Credentials = require('../../models/credentialModel');
const Student = require('../../models/studentModel');
const { UserType, UserEmailType } = require('../types.js');
const getDecoded = require('../../api/getDecoded.js');
const { sendMail } = require('../../utils/sendMail.js');

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
    resolve: async (parent, args) => {
      const { authToken, ...restArgs } = args;
      const { sub, email, username, profilePicture } = getDecoded(authToken);

      try {
        const user = await User.findBy({ email });

        // If not logged in with a valid account (determined by checking the sub value)
        if (user.sub && user.sub !== sub) {
          return new Error('You must be logged in with a valid account.');
        }

        // If the user specified in the auth token already exists
        if (user[0] && user[0].email) {
          const token = jwt({
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

        // If user does not yet exist in the records
        const res = await User.insert({
          sub,
          email,
          username,
          profilePicture,
          ...restArgs
        });
        const token = jwt({
          userId: res.id,
          email: res.email,
          roleId: res.roleId
        });
        return {
          ...res,
          token
        };
      } catch (err) {
        return new Error(err);
      }
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
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (Number(ctx.roleId) !== 1 && ctx.userId !== Number(args.id)) {
        return new Error('Unauthorized');
      }

      try {
        const res = await User.update(args.id, args);
        if (res) {
          const user = await User.findById(args.id);
          return user;
        }
        return new Error('The user could not be updated.');
      } catch {
        return new Error('There was an error completing your request.');
      }
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
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (Number(ctx.roleId) !== 1 && ctx.userId !== Number(args.id)) {
        return new Error('Unauthorized');
      }

      try {
        const res = await User.remove(args.id);
        if (res) {
          return {
            id: args.id
          };
        }
        return new Error('The user could not be deleted.');
      } catch (err) {
        return {
          error: err
        };
      }
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
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (Number(ctx.roleId) !== 1 && ctx.userId !== Number(args.userId)) {
        return new Error('Unauthorized');
      }

      let fullName = '';
      try {
        const res = await Student.findByUserId(args.userId);
        fullName = res.fullName;
      } catch (err) {
        return {
          error: err,
          message: 'error finding user'
        };
      }

      let res;
      try {
        res = await UserEmails.insert(args);
      } catch (err) {
        return {
          error: err,
          message: 'Unique constraint'
        };
      }

      try {
        res.credentials = await Credentials.findBy({
          studentEmail: args.email
        });

        const linkJwt = jwt({
          userId: res.id,
          email: args.email,
          roleId: 2
        });
        sendMail({
          recipientName: fullName,
          recipientEmail: args.email,
          jwt: linkJwt
        });

        return res;
      } catch (err) {
        return {
          error: err,
          message: 'Could not find added email'
        };
      }
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
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (Number(ctx.roleId) !== 1 && Number(ctx.roleId) !== 3) {
        return new Error('Unauthorized');
      }

      try {
        const res = UserEmails.remove(args.id);
        if (res) {
          return {
            id: args.id
          };
        }
        return new Error('The email could not be deleted.');
      } catch (err) {
        return {
          error: err
        };
      }
    }
  } // Delete User Email
};
