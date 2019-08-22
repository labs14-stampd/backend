const graphql = require('graphql');
const Users = require('../models/userModel.js');
const Roles = require('../models/roleModel.js');
const Schools = require('../models/schoolModel.js');
const Credentials = require('../models/credentialModel.js');
const Students = require('../models/studentModel');
const UserEmails = require('../models/userEmailsModel');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt
} = graphql;

const RoleType = new GraphQLObjectType({
  name: 'Role',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the role' },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique username of the user'
    },
    users: {
      type: new GraphQLList(UserType), // eslint-disable-line no-use-before-define
      description: 'Returns all users of specific role',
      resolve(parent) {
        return Users.findBy({ roleId: parent.id });
      }
    }
  })
});

const UserEmailType = new GraphQLObjectType({
  name: 'UserEmails',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the user email' },
    email: {
      type: GraphQLString,
      description: 'The email of the user'
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'User the email belongs to.'
    },
    valid: {
      type: GraphQLBoolean,
      description: 'Boolean for whether email was verified.'
    },
    credentials: {
      type: new GraphQLList(CredentialType),
      description: 'Credentials associated with email address'
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the user' },
    username: {
      type: GraphQLString,
      description: 'The unique username of the user'
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique email of the user'
    },
    profilePicture: {
      type: GraphQLString,
      description: 'The profile picture URL for the user'
    },
    roleId: {
      type: GraphQLID,
      description: 'The id for the role of the user'
    },
    sub: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Unique identifier returned by Auth0'
    },
    token: { type: GraphQLString, description: 'JWT token for user' },
    tokenExpiration: { type: GraphQLInt, description: 'Token expiration time' },
    role: {
      type: RoleType,
      description: 'The role associated with the user',
      resolve(parent) {
        return Roles.findById(parent.roleId);
      }
    },
    schoolDetails: {
      type: SchoolDetailsType, // eslint-disable-line no-use-before-define
      description: 'The school details associated with the user',
      resolve(parent) {
        if (parent.roleId === 2) {
          return Schools.findByUserId(parent.id);
        }
        return null;
      }
    },
    studentDetails: {
      type: StudentDetailsType, // eslint-disable-line no-use-before-define
      description: 'The school details associated with the user',
      resolve(parent) {
        if (parent.roleId === 3) {
          return Students.findByUserId(parent.id);
        }
        return null;
      }
    }
  })
});

const StudentDetailsType = new GraphQLObjectType({
  name: 'StudentDetails',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the school' },
    fullName: {
      type: GraphQLString,
      description: 'The full name of the student'
    },
    firstName: {
      type: GraphQLString,
      description: 'The first name of the student'
    },
    lastName: {
      type: GraphQLString,
      description: 'The last name of the student'
    },
    middleName: {
      type: GraphQLString,
      description: 'The middle name of the student'
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
    phone: {
      type: GraphQLString,
      description: 'The phone number of the school'
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The ID of the user associated with the school'
    },
    user: {
      type: UserType,
      description: 'The user associated with the school',
      resolve(parent) {
        return Users.findById(parent.userId);
      }
    },
    credentials: {
      type: new GraphQLList(CredentialType), // eslint-disable-line no-use-before-define
      description: 'The credentials associated with the school',
      async resolve(parent) {
        const user = await Users.findById(parent.userId);
        const emailList = await UserEmails.findBy({ userId: parent.userId });
        const creds = await Credentials.findBy({ studentEmail: user.email });
        // This is the email of the corresponding student account
        let listCreds = [];
        await Promise.all(
          emailList.map(async x => {
            const mapCreds = await Credentials.findBy({
              studentEmail: x.email
            });
            listCreds = [...listCreds, ...mapCreds];
          })
        );
        return [...creds, ...listCreds];
      }
    },
    emailList: {
      type: new GraphQLList(UserEmailType),
      description: 'List of additional user emails associated with an account',
      resolve(parent) {
        return UserEmails.findByUserId(parent.userId);
      }
    }
  })
});

const SchoolDetailsType = new GraphQLObjectType({
  name: 'SchoolDetails',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of the school' },
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
    },
    user: {
      type: UserType,
      description: 'The user associated with the school',
      resolve(parent) {
        return Users.findById(parent.userId);
      }
    },
    credentials: {
      type: new GraphQLList(CredentialType), // eslint-disable-line no-use-before-define
      description: 'The credentials associated with the school',
      resolve(parent) {
        return Credentials.findBySchoolId(parent.userId);
        // This is the user ID of the corresponding school account
      }
    }
  })
});

const CredentialType = new GraphQLObjectType({
  name: 'Credential',
  fields: () => ({
    id: { type: GraphQLID, description: 'The unique ID of a credential' },
    credName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the credential'
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Description of the credential'
    },
    credHash: {
      type: GraphQLString,
      description: 'Hash of credential information to be stored on blockchain'
    },
    txHash: {
      type: GraphQLString,
      description: 'Ethereum transaction hash for the credential'
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Type of credential'
    },
    ownerName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name associated with credential'
    },
    studentEmail: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Student email associated with credential'
    },
    imageUrl: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Image URL associated with credential'
    },
    criteria: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Criteria required to complete credential'
    },
    valid: {
      type: GraphQLBoolean,
      description: 'A boolean flag indicating if the credential is still valid'
    },
    issuedOn: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Date credential was issued'
    },
    expirationDate: {
      type: GraphQLString,
      description: 'Date that the credential will expire'
    },
    schoolId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'USER id associated with the school issuing the credential'
      // ^^^ This is the id in the 'users' table
    },
    schoolsUserInfo: {
      type: UserType, // eslint-disable-line no-use-before-define
      description: 'The user associated with the school',
      resolve(parent) {
        return Users.findById(parent.schoolId);
      }
    }
  })
});

module.exports = {
  UserType,
  RoleType,
  SchoolDetailsType,
  CredentialType,
  UserEmailType,
  StudentDetailsType
};
