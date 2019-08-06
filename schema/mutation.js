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

const {
  addUser,
  updateUser,
  deleteUser,
  addSchoolDetail,
  updateSchoolDetail
} = require('./mutations');

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser,
    updateUser,
    deleteUser,
    //************ School Details ************/
    addSchoolDetail,
    updateSchoolDetail,
    //************ Credential Details ************/
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
      async resolve(parent, args) {
        try {
          const credentialHash = web3.utils.sha3(JSON.stringify(args));
          const data = contract.methods.addCredential(credentialHash).encodeABI();
          if (data.length) {
            const hash = await txFunc(data);
            console.log("hash", hash);
            return Credential.insert(args).then(res => {
              return res;
            })
          } else {
            return new Error('The credential could not be created.');
          }
        } catch (error) {
          return new Error('There was an error completing your request.');
        }
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
