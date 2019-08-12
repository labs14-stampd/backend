const graphql = require('graphql');
const Credential = require('../models/credentialModel.js');
const { CredentialType } = require('./types.js');
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
    //* *********** School Details ************/
    addSchoolDetail,
    updateSchoolDetail,
    //* *********** Credential Details ************/
    addNewCredential: {
      type: CredentialType,
      description: 'Issues a new credential to a student',
      args: {
        credName: {
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
        credHash: {
          type: GraphQLString,
          description: 'Hash of new credential'
        },
        type: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Type of new credential'
        },
        ownerName: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Name associated with credential'
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
          args.credHash = credentialHash;
          const data = contract.methods
            .addCredential(credentialHash)
            .encodeABI();
          if (data.length) {
            args.txHash = await txFunc(data);
            args.valid = true;
            return Credential.insert(args).then(res => {
              return res;
            });
          }
          return new Error('The credential could not be created.');
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
        credName: {
          type: GraphQLString,
          description: 'Name of the new credential'
        },
        description: {
          type: GraphQLString,
          description: 'Description of the new credential'
        },
        credHash: {
          type: GraphQLString,
          description:
            'Hash of credential information to be stored on blockchain'
        },
        txHash: {
          type: GraphQLString,
          description: 'Ethereum transaction hash for the new credential'
        },
        type: {
          type: GraphQLString,
          description: 'Type of new credential'
        },
        ownerName: {
          type: GraphQLString,
          description: 'Name associated with credential'
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
      async resolve(parent, args) {
        if (!args.id || typeof Number(args.id) !== 'number') {
          return new Error('Please include a Credential ID and try again.');
        }
        try {
          const credentialHash = web3.utils.sha3(JSON.stringify(args));
          args.credHash = credentialHash;
          const data = contract.methods
            .addCredential(credentialHash)
            .encodeABI();
          if (data.length) {
            args.txHash = await txFunc(data);
            args.valid = true;
            return Credential.update(args.id, args).then(res => {
              return res;
            });
          }
          return new Error('The credential could not be updated.');
        } catch (error) {
          return new Error('There was an error completing your request.');
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
        },
        credHash: {
          type: GraphQLString,
          description:
            'Hash of credential information to be stored on blockchain'
        }
      },
      async resolve(parent, args) {
        console.log('in delete resolver', args);
        if (!args.id || typeof Number(args.id) !== 'number') {
          return new Error('Please include a credential ID and try again.');
        }
        try{
          const data = contract.methods
            .removeCredential(args.credHash)
            .encodeABI();
          if(data.length){
            const result = await txFunc(data);
            console.log('result ', result);
            return Credential.remove(args.id)
              .then(res => {
                if (res) {
                  return { id: args.id };
                }
                return new Error('The credential could not be deleted.');
              });
          }
        }catch(error){
          return new Error('There was an error completing your request.');
        }

      }
    }, // Remove Credential
    invalidateCredential: {
      type: CredentialType,
      description: 'Invalidates a Credential',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique id of the credential to be deleted'
        },
        credName: {
          type: GraphQLString,
          description: 'Name of the new credential'
        },
        description: {
          type: GraphQLString,
          description: 'Description of the new credential'
        },
        credHash: {
          type: GraphQLString,
          description:
            'Hash of credential information to be stored on blockchain'
        },
        txHash: {
          type: GraphQLString,
          description: 'Ethereum transaction hash for the new credential'
        },
        type: {
          type: GraphQLString,
          description: 'Type of new credential'
        },
        ownerName: {
          type: GraphQLString,
          description: 'Name associated with credential'
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
      async resolve(parent, args) {
        if (!args.id || typeof Number(args.id) !== 'number') {
          return new Error('Please include a credential ID and try again.');
        }

        try {
          const data = contract.methods
            .invalidateCredential(
              args.credHash
            )
            .encodeABI();
          if (data.length) {
            args.txHash = await txFunc(data);
            args.valid = false;
            return Credential.update(args.id, args).then(res => {
              if (res) {
                return { id: args.id };
              }
              return new Error('The credential could not be invalidated.');
            });
          } else {
            return new Error('The credential could not be invalidated.');
          }
        } catch (error) {
          return new Error('There was an error completing your request.');
        }
      }
    }, //invalidateCredential
    validateCredential: {
      type: CredentialType,
      description: 'Validates an invalidated Credential',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique id of the credential to be validated'
        },
        credName: {
          type: GraphQLString,
          description: 'Name of the new credential'
        },
        description: {
          type: GraphQLString,
          description: 'Description of the new credential'
        },
        credHash: {
          type: GraphQLString,
          description:
            'Hash of credential information to be stored on blockchain'
        },
        txHash: {
          type: GraphQLString,
          description: 'Ethereum transaction hash for the new credential'
        },
        type: {
          type: GraphQLString,
          description: 'Type of new credential'
        },
        ownerName: {
          type: GraphQLString,
          description: 'Name associated with credential'
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
      async resolve(parent, args) {
        if (!args.id || typeof Number(args.id) !== 'number') {
          return new Error('Please include a credential ID and try again.');
        }
        try {

          const data = contract.methods
            .validateCredential(
              args.credHash
            )
            .encodeABI();
          if (data.length) {
            args.txHash = await txFunc(data);
            args.valid = true;
            return Credential.update(args.id, args).then(res => {
              if (res) {
                return { id: args.id };
              }
              return new Error('The credential could not be validated.');
            });
          } else {
            return new Error('The credential could not be validated.');
          }
        } catch (error) {
          return new Error('There was an error completing your request.');
        }
      }
    } //validateCredential
  })
});

module.exports = {
  Mutation
};
