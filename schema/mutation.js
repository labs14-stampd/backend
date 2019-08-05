const graphql = require('graphql');
const jwt = require('../api/tokenService.js');
const User = require('../models/userModel.js');
const School = require('../models/schoolModel.js');
const Credential = require('../models/credentialModel.js');
const { UserType, SchoolDetailsType, CredentialType } = require('./types.js');
const getDecoded = require('../api/getDecoded.js');
const { txFunc, web3, contract } = require('../web3/web3.js');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} = graphql;

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
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
                roleId: user.roleId
              });
              return {
                ...res,
                token
              };
            })
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
                return new Error('The School could not be updated.');
              }
            })
            .catch(err => {
              return new Error('There was an error completing your request.');
            });
        }
      }
    }, //Update School Detail
    //************ School Details ************/
    addNewCredential: {
      type: CredentialType,
      description: 'Issues a new credential to a student',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Name of the new credential'
        },
        description: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Description of the new credential'
        },
        txHash: {
          type: GraphQLString,
          description: 'Ethereum transaction hash for the new credential'
        },
        type: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Type of new credential'
        },
        studentEmail: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Student email associated with new credential'
        },
        imageUrl: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Image URL associated with new credential'
        },
        criteria: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Criteria required to complete new credential'
        },
        valid: {
          type: GraphQLBoolean,
          description:
            'A boolean flag indicating if the new credential is still valid'
        },
        issuedOn: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Date new credential was issued'
        },
        expirationDate: {
          type: GraphQLString,
          description: 'Date that the new credential will expire'
        },
        schoolId: {
          type: new GraphQLNonNull(GraphQLID),
          description:
            'USER id associated with the school issuing the new credential'
          // ^^^ This is the id in the 'users' table
        }
      },
      resolve(parent, args) {
        const credentialHash = web3.utils.sha3(JSON.stringify(args));
        const data = contract.methods.addCredential(credentialHash).encodeABI();
        return Credential.insert(args)
          .then(res => {
            if (res) {
              txFunc(data, function(receipt) {
                //set txHash of object to the transactionHash returned in receipt
                args.txHash = receipt.logs[0].transactionHash;
                Credential.update(res.id, args);
              });
              return res;
            } else {
              return new Error('The credential could not be created.');
            }
          })
          .catch(err => {
            return new Error(err);
          });
      }
    }, // add new credential
    updateCredential: {
      type: CredentialType,
      description: 'Updates a credential',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique ID of the user to be deleted'
        },
        name: {
          type: GraphQLString,
          description: 'Name of the new credential'
        },
        description: {
          type: GraphQLString,
          description: 'Description of the new credential'
        },
        txHash: {
          type: GraphQLString,
          description: 'Ethereum transaction hash for the new credential'
        },
        type: {
          type: GraphQLString,
          description: 'Type of new credential'
        },
        studentEmail: {
          type: GraphQLString,
          description: 'Student email associated with new credential'
        },
        imageUrl: {
          type: GraphQLString,
          description: 'Image URL associated with new credential'
        },
        criteria: {
          type: GraphQLString,
          description: 'Criteria required to complete new credential'
        },
        valid: {
          type: GraphQLBoolean,
          description:
            'A boolean flag indicating if the new credential is still valid'
        },
        issuedOn: {
          type: GraphQLString,
          description: 'Date new credential was issued'
        },
        expirationDate: {
          type: GraphQLString,
          description: 'Date that the new credential will expire'
        },
        schoolId: {
          type: GraphQLID,
          description:
            'USER id associated with the school issuing the new credential'
          // ^^^ This is the id in the 'users' table
        }
      },
      resolve(parent, args) {
        if (!args.id || isNaN(args.id)) {
          return new Error('Please include a Credential ID and try again.');
        } else {
          const credentialHash = web3.utils.sha3(JSON.stringify(args));
          const data = contract.methods
            .addCredential(credentialHash)
            .encodeABI();
          txFunc(data, function(receipt) {
            //set txHash of object to the transactionHash returned in receipt
            args.txHash = receipt.logs[0].transactionHash;
            return Credential.update(args.id, args)
              .then(res => {
                if (res) {
                  return res;
                } else {
                  return new Error('The credential could not be updated.');
                }
              })
              .catch(err => {
                return new Error('There was an error completing your request.');
              });
          });
        }
      }
    }, // Update Credential
    removeCredential: {
      type: CredentialType,
      description: 'Removes a credential',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique ID of the credential to be deleted'
        }
      },
      resolve(parent, args) {
        if (!args.id || isNaN(args.id)) {
          return new Error('Please include a credential ID and try again.');
        } else {
          return Credential.remove(args.id)
            .then(res => {
              if (res) {
                return { id: args.id };
              } else {
                return new Error('The credential could not be deleted.');
              }
            })
            .catch(err => {
              return { error: err };
            });
        }
      }
    } // Remove Credential
  })
});

module.exports = {
  Mutation
};
