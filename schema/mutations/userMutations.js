const getDecoded = require('../../api/getDecoded.js');
const jwt = require('../../api/tokenService.js');
const { sendMail } = require('../../utils/sendMail.js');

const User = require('../../models/userModel.js');
const Student = require('../../models/studentModel');
const UserEmails = require('../../models/userEmailsModel');
const Credentials = require('../../models/credentialModel');

const { UserType, UserEmailType } = require('../types.js');
const errorTypes = require('../errors');
const { GraphQLString, GraphQLID, GraphQLBoolean } = require('graphql');

module.exports = {
  addUser: {
    type: UserType,
    description: 'Adds a new user',
    args: {
      authToken: {
        type: GraphQLString,
        description: 'The unique Auth0 token of the new user'
      },
      roleId: {
        type: GraphQLID,
        description: 'The role associated with the new user'
      }
    },
    resolve: async (parent, args) => {
      const { authToken, ...restArgs } = args;
      // When authToken parameter is missing
      if (!authToken) {
        return new Error(errorTypes.MISSING_PARAMETER.AUTH_TOKEN);
      }

      const { sub, email, username, profilePicture } = getDecoded(authToken);

      try {
        const user = await User.findBy({ email });

        // If the user specified in the auth token already exists
        if (user[0]) {
          // If login is not valid (determined by checking the sub value)
          if (user[0].sub !== sub) {
            return new Error(errorTypes.INVALID_LOGIN);
          }

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
      } catch (error) {
        if (error.code === '23503') {
          // When a foreign key constraint is violated, determine which foreign key value does not exist
          if (error.constraint === 'users_roleid_foreign') {
            return new Error(errorTypes.NOT_FOUND.ROLE);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        } else if (error.code === '23505') {
          // When unique constraint is violated, determine which field got a non-unique value
          if (error.constraint === 'users_username_unique') {
            return new Error(errorTypes.NOT_UNIQUE.USER.USERNAME);
          }
          if (error.constraint === 'users_sub_unique') {
            return new Error(errorTypes.NOT_UNIQUE.USER.SUB);
          }
          return new Error(
            `${errorTypes.NOT_UNIQUE.GENERIC} - violation of ${error.constraint}`
          );
        }

        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  }, // Add User
  updateUser: {
    type: UserType,
    description: 'Updates an existing user by user ID',
    args: {
      id: {
        type: GraphQLID,
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
      if (
        !ctx ||
        (Number(ctx.roleId) !== 1 && ctx.userId !== Number(args.id))
      ) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When ID parameter is missing
      if (!args.id) {
        return new Error(errorTypes.MISSING_PARAMETER.USER.ID);
      }

      // Check if email is already taken in userEmails table
      if (args.email) {
        try {
          const matches = await UserEmails.findBy({ email: args.email });
          if (matches && matches.length) {
            return new Error(errorTypes.NOT_UNIQUE.EMAIL_ADDRESS);
          }
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }

      try {
        const res = await User.update(args.id, args);
        if (res) {
          return res;
        }
        return new Error(errorTypes.NOT_FOUND.USER);
      } catch (error) {
        if (error.code === '23503') {
          // When a foreign key constraint is violated, determine which foreign key value does not exist
          if (error.constraint === 'users_roleid_foreign') {
            return new Error(errorTypes.NOT_FOUND.ROLE);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        } else if (error.code === '23505') {
          // When unique constraint is violated, determine which field got a non-unique value
          if (error.constraint === 'users_username_unique') {
            return new Error(errorTypes.NOT_UNIQUE.USER.USERNAME);
          }
          if (error.constraint === 'users_email_unique') {
            return new Error(errorTypes.NOT_UNIQUE.EMAIL_ADDRESS);
          }
          if (error.constraint === 'users_sub_unique') {
            return new Error(errorTypes.NOT_UNIQUE.USER.SUB);
          }
          return new Error(
            `${errorTypes.NOT_UNIQUE.GENERIC} - violation of ${error.constraint}`
          );
        }

        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  }, // Update User
  deleteUser: {
    type: UserType,
    description: 'Deletes an existing user by user ID',
    args: {
      id: {
        type: GraphQLID,
        description: 'The unique ID of the user to be deleted'
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (
        !ctx ||
        (ctx.userId !== Number(args.id) && Number(ctx.roleId) !== 1)
      ) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When ID parameter is missing
      if (!args.id) {
        return new Error(errorTypes.MISSING_PARAMETER.USER.ID);
      }

      try {
        const res = await User.remove(args.id);
        if (res) {
          return {
            id: args.id
          };
        }
        return new Error(errorTypes.NOT_FOUND.USER);
      } catch (error) {
        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  }, // Delete User
  addUserEmail: {
    type: UserEmailType,
    description: 'Adds additional emails to a user',
    args: {
      email: {
        type: GraphQLString,
        description: 'The email of the user'
      },
      userId: {
        type: GraphQLID,
        description: 'User the email belongs to.'
      },
      valid: {
        type: GraphQLBoolean,
        description: 'Boolean for whether email was verified.'
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (
        !ctx ||
        (ctx.userId !== Number(args.userId) && Number(ctx.roleId) !== 1)
      ) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When email parameter is missing
      if (!args.email) {
        return new Error(errorTypes.MISSING_PARAMETER.USEREMAIL.EMAIL);
      }
      // When user ID parameter is missing
      if (!args.userId) {
        return new Error(errorTypes.MISSING_PARAMETER.USER.ID);
      }

      // Check if email is already taken in users table
      if (args.email) {
        try {
          const matches = await User.findBy({ email: args.email });
          if (matches && matches.length) {
            return new Error(errorTypes.NOT_UNIQUE.EMAIL_ADDRESS);
          }
        } catch (error) {
          return new Error(`${errorTypes.GENERIC} (${error.message})`);
        }
      }

      let fullName = '';
      try {
        const res = await Student.findByUserId(args.userId);
        if (res) {
          fullName = res.fullName;
        } else {
          return new Error(errorTypes.NOT_FOUND.USER);
        }
      } catch (error) {
        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }

      let res;
      try {
        res = await UserEmails.insert(args);
      } catch (error) {
        if (error.code === '23503') {
          // When a foreign key constraint is violated, determine which foreign key value does not exist
          if (error.constraint === 'useremails_userid_foreign') {
            return new Error(errorTypes.NOT_FOUND.USER);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        } else if (error.code === '23505') {
          // When unique constraint is violated, determine which field got a non-unique value
          if (error.constraint === 'useremails_email_unique') {
            return new Error(errorTypes.NOT_UNIQUE.EMAIL_ADDRESS);
          }
          return new Error(
            `${errorTypes.NOT_UNIQUE.GENERIC} - violation of ${error.constraint}`
          );
        }

        return new Error(`${errorTypes.GENERIC} (${error.message})`);
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
      } catch (error) {
        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  }, // Add user email
  deleteUserEmail: {
    type: UserEmailType,
    description: 'Deletes an email associated with a unique user',
    args: {
      id: {
        type: GraphQLID,
        description: 'The unique ID of the user to be deleted'
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (!ctx || (Number(ctx.roleId) !== 3 && Number(ctx.roleId) !== 1)) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When ID parameter is missing
      if (!args.id) {
        return new Error(errorTypes.MISSING_PARAMETER.USEREMAIL.ID);
      }

      try {
        const res = await UserEmails.remove(args.id);
        if (res) {
          return {
            id: args.id
          };
        }
        return new Error(errorTypes.NOT_FOUND.USEREMAIL);
      } catch (error) {
        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  } // Delete User Email
};
