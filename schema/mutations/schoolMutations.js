const graphql = require('graphql');
const School = require('../../models/schoolModel.js');
const Users = require('../../models/userModel.js');
const { SchoolDetailsType } = require('../types.js');
const jwt = require('../../api/tokenService');

const { GraphQLString, GraphQLNonNull, GraphQLID } = graphql;

module.exports = {
  //* *********** School Details ************/
  addSchoolDetail: {
    type: SchoolDetailsType,
    description: 'Adds school details to an existing user',
    args: {
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
      }
    },
    resolve: async (parent, args, ctx) => {
      // Authorization check
      if (!ctx.isAuth) {
        return new Error('Unauthorized');
      }

      try {
        const newSchool = await School.insert(args);

        const user = await Users.findById(args.userId);
        const token = jwt({
          userId: newSchool.userId,
          email: user.email,
          roleId: user.roleId
        });

        return { ...newSchool, token };
      } catch (error) {
        return new Error('There was an error completing your request.');
      }
    }
  }, // Add School Detail
  updateSchoolDetail: {
    type: SchoolDetailsType,
    description: 'Updates school details for a user',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
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
      if (Number(ctx.roleId) !== 2 && Number(ctx.roleId) !== 1) {
        return new Error('Unauthorized');
      }

      try {
        const res = School.update(args.id, args);
        if (res) {
          return res;
        }
        return new Error('The School could not be updated.');
      } catch {
        return new Error('There was an error completing your request.');
      }
    }
  } // Update School Detail
};
