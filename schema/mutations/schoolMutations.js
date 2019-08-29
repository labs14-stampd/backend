const jwt = require('../../api/tokenService');

const School = require('../../models/schoolModel.js');
const Users = require('../../models/userModel.js');

const { SchoolDetailsType } = require('../types.js');
const errorTypes = require('../errors');
const { GraphQLString, GraphQLID } = require('graphql');

module.exports = {
  //* *********** School Details ************/
  addSchoolDetail: {
    type: SchoolDetailsType,
    description: 'Adds school details to an existing user',
    args: {
      name: {
        type: GraphQLString,
        description: 'The unique name of the school'
      },
      taxId: {
        type: GraphQLString,
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
        type: GraphQLString,
        description: 'The phone number of the school'
      },
      url: {
        type: GraphQLString,
        description: 'The website url of the school'
      },
      userId: {
        type: GraphQLID,
        description: 'The ID of the user associated with the school'
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (!ctx || !ctx.isAuth) {
        // Also account for missing context to ensure error handling for unauthenticated users
        return new Error(errorTypes.UNAUTHORIZED);
      }

      // When name parameter is missing
      if (!args.name) {
        return new Error(errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.NAME);
      }
      // When tax ID parameter is missing
      if (!args.taxId) {
        return new Error(errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.TAX_ID);
      }
      // When phone parameter is missing
      if (!args.phone) {
        return new Error(errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.PHONE);
      }
      // When URL parameter is missing
      if (!args.url) {
        return new Error(errorTypes.MISSING_PARAMETER.SCHOOLDETAIL.URL);
      }
      // When user ID parameter is missing
      if (!args.userId) {
        return new Error(errorTypes.MISSING_PARAMETER.USER.ID);
      }

      // When data input type of user ID parameter is incorrect (not a number)
      if (isNaN(args.userId)) {
        return new Error(errorTypes.TYPE_MISMATCH.USER.ID);
      }

      try {
        const user = await Users.findById(args.userId);

        const newSchool = await School.insert(args);
        const token = jwt({
          userId: newSchool.userId,
          email: user.email,
          roleId: user.roleId
        });

        return { ...newSchool, token };
      } catch (error) {
        if (error.code === '23503') {
          // When a foreign key constraint is violated (ex.: using a nonexistent foreign key ID value), determine which foreign key value does not exist
          if (error.constraint === 'schooldetails_userid_foreign') {
            return new Error(errorTypes.NOT_FOUND.USER);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        } else if (error.code === '23505') {
          // When unique constraint is violated, determine which field got a non-unique value
          if (error.constraint === 'schooldetails_name_unique') {
            return new Error(errorTypes.NOT_UNIQUE.SCHOOLDETAIL.NAME);
          }
          if (error.constraint === 'schooldetails_taxid_unique') {
            return new Error(errorTypes.NOT_UNIQUE.SCHOOLDETAIL.TAX_ID);
          }
          return new Error(
            `${errorTypes.NOT_UNIQUE.GENERIC} - violation of ${error.constraint}`
          );
        }

        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  }, // Add School Detail
  updateSchoolDetail: {
    type: SchoolDetailsType,
    description: 'Updates school details for a user',
    args: {
      id: {
        type: GraphQLID,
        description: 'The unique ID of the user to be deleted'
      },
      name: {
        type: GraphQLString,
        description: 'The unique name of the school'
      },
      taxId: {
        type: GraphQLString,
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
        type: GraphQLString,
        description: 'The phone number of the school'
      },
      url: {
        type: GraphQLString,
        description: 'The website url of the school'
      },
      userId: {
        type: GraphQLID,
        description: 'The ID of the user associated with the school'
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
      // When user ID parameter is provided but data input type is incorrect (not a number)
      if (args.userId && isNaN(args.userId)) {
        return new Error(errorTypes.TYPE_MISMATCH.USER.ID);
      }

      try {
        const res = await School.update(args.id, args);
        if (res) {
          return res;
        }
        return new Error(errorTypes.NOT_FOUND.SCHOOLDETAIL);
      } catch (error) {
        if (error.code === '23503') {
          // When a foreign key constraint is violated, determine which foreign key value does not exist
          if (error.constraint === 'schooldetails_userid_foreign') {
            return new Error(errorTypes.NOT_FOUND.USER);
          }
          // If no match for violated foreign key constraint, throw a generic error outside of the if-else block
        } else if (error.code === '23505') {
          // When unique constraint is violated, determine which field got a non-unique value
          if (error.constraint === 'schooldetails_name_unique') {
            return new Error(errorTypes.NOT_UNIQUE.SCHOOLDETAIL.NAME);
          }
          if (error.constraint === 'schooldetails_taxid_unique') {
            return new Error(errorTypes.NOT_UNIQUE.SCHOOLDETAIL.TAX_ID);
          }
          return new Error(
            `${errorTypes.NOT_UNIQUE.GENERIC} - violation of ${error.constraint}`
          );
        }

        return new Error(`${errorTypes.GENERIC} (${error.message})`);
      }
    }
  } // Update School Detail
};
