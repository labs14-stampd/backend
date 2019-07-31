const graphql = require('graphql');
const User = require('../models/userModel.js');
const School = require('../models/schoolModel.js');
const yup = require('yup');
const { UserType, SchoolDetailsType, CredentialType } = require('./types.js');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} = graphql;

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Adds a new user',
      args: {
        username: {
          type: GraphQLString,
          description: 'The username of the new user'
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The unique email of the new user'
        },
        roleId: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return User.findBy({ email: args.email }).then(user => {
          if(user[0] && user[0].email) return user[0];
          return User.insert({ ...args })
            .then(res => res)
            .catch(err => {
              return new Error(err);
            });
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
        if (!args.id || isNaN(args.id)) {
          return new Error('Please include a user ID and try again.');
        } else {
          return User.update(args.id, args)
            .then(res => {
              if (res) {
                return User.findById(args.id)
                  .then(res => {
                    return res;
                  })
                  .catch(err => {
                    return new Error(
                      'There was an error completing your request.'
                    );
                  });
              } else {
                return new Error('The user could not be updated.');
              }
            })
            .catch(err => {
              return new Error('There was an error completing your request.');
            });
        }
      }
    }, //Update User
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
        if (!args.id || isNaN(args.id)) {
          return new Error('Please include a user ID and try again.');
        } else {
          return User.remove(args.id)
            .then(res => {
              if (res) {
                return { id: args.id };
              } else {
                return new Error('The user could not be deleted.');
              }
            })
            .catch(err => {
              return { error: err };
            });
        }
      }
    }, // Delete User
    //************ School Details ************/
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
      resolve(parent, args) {
        return School.insert(args)
          .then(res => res)
          .catch(err => {
            return new Error(err);
          });
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
      resolve(parent, args) {
        if (!args.id || isNaN(args.id)) {
          return new Error('Please include a SchoolDetails ID and try again.');
        } else {
          return School.update(args.id, args)
            .then(res => {
              if (res) {
                return res;
              } else {
                return new Error('The user could not be updated.');
              }
            })
            .catch(err => {
              return new Error('There was an error completing your request.');
            });
        }
      }
    } //Update School Detail
  })
});

module.exports = {
  Mutation
};

// addUser: {
//   type: UserType,
//   description: 'Adds a new user',
//   args: {
//     username: yup.object().shape({
//       username: yup
//         .string()
//         .trim()
//         .require()
//     }),
//     firstName: {
//       type: GraphQLString,
//       description: 'The first name of the new user'
//     },
//     middleName: {
//       type: GraphQLString,
//       description: 'The middle name of the new user'
//     },
//     lastName: {
//       type: GraphQLString,
//       description: 'The last name of the new user'
//     },
//     email: {
//       type: GraphQLNonNull(GraphQLString),
//       description: 'The unique email of the new user'
//     },
//     phone: {
//       type: GraphQLString,
//       description: 'The phone number of the new user'
//     },
//     street1: {
//       type: GraphQLString,
//       description: "Street line 1 of the new user's address"
//     },
//     street2: {
//       type: GraphQLString,
//       description: "Street line 2 of the new user's address"
//     },
//     city: { type: GraphQLString, description: 'The city of the new user' },
//     state: {
//       type: GraphQLString,
//       description: 'The state of the new user'
//     },
//     zip: {
//       type: GraphQLString,
//       description: 'The zip code of the new user'
//     }
//   },
//   resolve(parent, args) {
//     if (!args.username || !args.email) {
//       return new Error(
//         'Please include the required credentials and try again.'
//       );
//     } else {
//       const newUser = { ...args };
//       return User.insert(newUser)
//         .then(res => {
//           if (res.rowCount) {
//             return User.findByUsername(args.username)
//               .then(res => {
//                 if (res) {
//                   return res;
//                 } else {
//                   return new Error(
//                     'There was an error returning the new user.'
//                   );
//                 }
//               })
//               .catch(err => {
//                 return new Error(
//                   'There was an error completing your request.'
//                 );
//               });
//           } else {
//             return new Error('The user could not be created.');
//           }
//         })
//         .catch(err => {
//           return new Error('There was an error completing your request.');
//         });
//     }
//   }
// },
// updateUser: {
//   type: UserType,
//   description: 'Updates an existing user by user ID',
//   args: {
//     id: {
//       type: GraphQLNonNull(GraphQLID),
//       description: 'The unique ID of the user'
//     },
//     username: {
//       type: GraphQLString,
//       description: 'The unique username of the user'
//     },
//     firstName: {
//       type: GraphQLString,
//       description: 'The first name of the user'
//     },
//     middleName: {
//       type: GraphQLString,
//       description: 'The middle name of the user'
//     },
//     lastName: {
//       type: GraphQLString,
//       description: 'The last name of the user'
//     },
//     email: {
//       type: GraphQLString,
//       description: 'The unique email of the user'
//     },
//     phone: {
//       type: GraphQLString,
//       description: 'The phone number of the user'
//     },
//     street1: {
//       type: GraphQLString,
//       description: "Street line 1 of the user's address"
//     },
//     street2: {
//       type: GraphQLString,
//       description: "Street line 2 of the user's address"
//     },
//     city: { type: GraphQLString, description: 'The city of the user' },
//     state: { type: GraphQLString, description: 'The state of the user' },
//     zip: { type: GraphQLString, description: 'The zip code of the user' }
//   },
//   resolve(parent, args) {
//     const userChanges = { ...args };
//     return User.update(args.id, userChanges)
//       .then(res => {
//         if (res) {
//           return User.findById(args.id)
//             .then(res => {
//               return res;
//             })
//             .catch(err => {
//               return new Error(
//                 'There was an error completing your request.'
//               );
//             });
//         } else {
//           return new Error('The user could not be updated.');
//         }
//       })
//       .catch(err => {
//         return new Error('There was an error completing your request.');
//       });
//   }
// },
// deleteUser: {
//   type: UserType,
//   description: 'Deletes an existing user by user ID',
//   args: {
//     id: {
//       type: GraphQLNonNull(GraphQLID),
//       description: 'The unique ID of the user'
//     }
//   },
//   resolve(parent, args) {
//     if (!args.id) {
//       return new Error('Please include a user ID and try again.');
//     } else {
//       return User.remove(args.id)
//         .then(res => {
//           if (res) {
//             return { id: args.id };
//           } else {
//             return new Error('The user could not be deleted.');
//           }
//         })
//         .catch(err => {
//           return new Error('There was an error completing your request.');
//         });
//     }
//   }
// }
