<a href="https://heroku.com/deploy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

![eslint](https://img.shields.io/badge/eslint-airbnb-hotpink) ![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg)

#

<h1 align="center"><img src="./assets/readme-header.png" /></h1>

# Stampd Server

## Introduction

The education industry has a big problem; in addition to the student debt crisis and other issues, post-student life is often a complete mess. One of these key areas is the credentialing process. Employers and students are often left hanging while employment verifications or the general verification process takes days (or even weeks) to finish. This leaves employers at risk of being understaffed, schools in danger of being short-staffed in their registrars' offices, and students in a position of losing out on great jobs. This is exactly the part where Stampd comes in.

Stampd is a blockchain-based project that allows educational institutions to permanently issue fully verified credentials that are stamped to the Ethereum blockchain. Using blockchain technology, educational institutions can have a fast and cost-effective way to take care of their students; within minutes, a school can issue a credential and email it out, while employers can have peace of mind in knowing that there's no secret way the credential could have been modified or tampered with. This enables fast hires, low budgetary costs, and happy new employees.

Easy. Verified. Blockchain. Credentials with Stampd.

## Contributors

|                                            [Aljoe Bacus](https://github.com/joepound)                                             |                                               [Brannan Conrad](https://github.com/BrannanC)                                               |                                      [Byron Holmes](https://github.com/byronholmes2018)                                       |                                            [Megan Jeffcoat](https://github.com/meganjeffcoat)                                            |                                           [CJ Tantay](https://github.com/cjbt)                                            |                                         [Nathan Thomas](https://github.com/nwthomas)                                          |
| :-------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: |
|      [<img src="https://avatars2.githubusercontent.com/u/14357797?s=460&v=4" width = "150" />](https://github.com/joepound)       |          [<img src="https://avatars1.githubusercontent.com/u/39506884?s=460&v=4" width = "150" />](https://github.com/BrannanC)           | [<img src="https://avatars1.githubusercontent.com/u/40626585?s=460&v=4" width = "150" />](https://github.com/byronholmes2018) |       [<img src="https://avatars3.githubusercontent.com/u/44781690?s=400&v=4" width = "150" />](https://github.com/meganjeffcoat)        |     [<img src="https://avatars3.githubusercontent.com/u/8962594?s=460&v=4" width = "150" />](https://github.com/cjbt)     |    [<img src="https://avatars3.githubusercontent.com/u/28681364?s=460&v=4" width = "150" />](https://github.com/nwthomas)     |
|                       [<img src="https://github.com/favicon.ico" width="20"> ](https://github.com/joepound)                       |                           [<img src="https://github.com/favicon.ico" width="20"> ](https://github.com/BrannanC)                           |                 [<img src="https://github.com/favicon.ico" width="20"> ](https://github.com/byronholmes2018)                  |                        [<img src="https://github.com/favicon.ico" width="20"> ](https://github.com/meganjeffcoat)                        |                     [<img src="https://github.com/favicon.ico" width="20"> ](https://github.com/cjbt)                     |                     [<img src="https://github.com/favicon.ico" width="20"> ](https://github.com/nwthomas)                     |
| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/aljoe-luis-bacus/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/brannan-conrad-18852616b/) |                                                                                                                               | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/megan-jeffcoat-b46b8287/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/cjtantay/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="20"> ](https://www.linkedin.com/in/nwthomas-dev/) |

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation and Setup](#installation-and-setup)
  - [Environment Variables](#environment-variables)
- [Technology Stack](#technology-stack)
  - [Node and Express](#node-and-express)
  - [GraphQL](#graphql)
  - [PostgreSQL](#postgresql)
  - [Web3](#web3)
  - [Production Dependencies](#production-dependencies)
  - [Development Dependencies](#development-dependencies)
- [API Examples](#api-documentation)
  - [Example Query](#example-query)
  - [Example Mutation](#example-mutation)
- [Data Models](#data-models)
  - [Role](#role)
  - [User](#user)
  - [School Details](#school-details)
  - [Credential](#credential)
- [Query and Mutation List](#query-and-mutation-list)
  - [Queries](#queries)
  - [Mutations](#mutations)
- [Project Management](#project-management)
- [Contributing and Getting Involved](#contributing-and-getting-involved)
  - [Issue and Bug Requests](#issue-and-bug-requests)
  - [Feature Requests](#feature-requests)
  - [Pull Request Guidelines](#pull-request-guidelines)
- [Additional Documentation](#additional-documentation)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Getting Started

This repository contains a **yarn.lock** file. Please do not remove this file, as the integrity of the application cannot be gauranteed(especially with packages such as **Web3.js**) if versions that may be incompatible with each other are used by installing the newest version of each dependency.

#### Installation and Setup

To get the server running locally, clone this repo and use the following commands/steps:

1. Install `Node Version Manager` (or `nvm`) by following the installation instructions [here](https://github.com/nvm-sh/nvm) (due to dependency reasons, this project requires the use of `Node.js` version 10, and `nvm` allows us to do this)
2. Use the **yarn** command in the root directory to install all required dependencies
3. Use the **nvm use 10** command to switch the `Node.js` version used to `10`
4. Use the **yarn server** command in the root directory to start the local server
5. Use the **yarn test** to start server using testing environment

#### Environment Variables

In order for the app to function correctly, you must set up the correct environment variables. Please create a `.env` file that includes the following:

```
* PORT = Port to run server on
* TESTING_DATABASE_URL = Url for testing database
* DATABASE_URL = Url for database
* NODE_SERVER_SENTRY = Sentry URI for continuous integration
* PK = Secret used for hashing JWTs
* REACT_APP_AUTH_TOKEN = Another secret used for hashing other JWTs
* CONTRACT_ADDRESS = Address of contract deployed to Ethereum blockchain
* INFURA = URL of Infura API
* PRIVATE_KEY = Private key for Infura
* ACCOUNT_1 = Owner address for Ethereum contract
```

## Technology Stack

The following is a short list of the major dependencies used (with the reasons we used them) followed by complete and exhaustive ones with all production and development packages incorporated in the server build.

#### Node and Express

- Javascript in the language of choice for the back-end
- Express allows for easy API creation
- Middleware patterns are easy and fluid in Express

#### GraphQL

- Built on top of Express
- One endpoint allows for fast development speed
- Schema is built into GraphQL Playground

#### PostgreSQL

- Works well with Heroku

#### Web3

- Web3 allows for a direct connection to the Ethereum Virtual Machine, or EVM
- Builds out suite of tools for connecting, posting, and retrieving data through the use of wallets

#### Production Dependencies

- [cors](https://expressjs.com/en/resources/middleware/cors.html)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [ethereumjs-tx](https://github.com/ethereumjs/ethereumjs-tx)
- [express](https://expressjs.com/)
- [express-graphql](https://github.com/graphql/express-graphql)
- [graphql](https://www.npmjs.com/package/graphql)
- [graphql-playground-middleware-express](https://www.npmjs.com/package/graphql-playground-middleware-express)
- [helmet](https://helmetjs.github.io/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [jwt-decode](https://github.com/auth0/jwt-decode)
- [knex](http://knexjs.org/)
- [pg](https://www.npmjs.com/package/pg)
- [sentry](https://sentry.io/welcome/)
- [web3](https://github.com/ethereum/web3.js/)

#### Development Dependencies

- [cross-env](https://www.npmjs.com/package/cross-env)
- [eslint](https://eslint.org/)
- [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
- [jest](https://jestjs.io/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [prettier](https://github.com/prettier/prettier)
- [supertest](https://github.com/visionmedia/supertest)

## API Examples

The server is deployed at [https://stampd-backend.herokuapp.com/](https://stampd-backend.herokuapp.com/).

The server IDE GraphQL Playground is deployed at [https://stampd-backend.herokuapp.com/playground](https://stampd-backend.herokuapp.com/playground).

Here are some examples of a GraphQL query and mutation on this server along with corresponding JSON that is returned:

#### Example Query

```graphql
query {
  getSchoolDetailsBySchoolId(id: 1) {
    name
    street1
    street2
    city
    state
    zip
    type
    phone
    url
    user {
      email
    }
  }
}
```

```json
{
  "data": {
    "getSchoolDetailsBySchoolId": {
      "name": "School of the Midweast",
      "street1": "Midway St.",
      "street2": null,
      "city": "Midway City",
      "state": "MA",
      "zip": "5050",
      "type": "University",
      "phone": "555-5555",
      "url": "https://www.midweast.edu/",
      "user": {
        "email": "schoolzrus@rocketmail.com"
      }
    }
  }
}
```

#### Example Mutation

```graphql
mutation {
  addNewCredential(
    criteria: "Asserts student has completed all requirements for certification in welding at Elgin Community College"
    description: "Basic concepts of oxy-acetylene welding and electric welding for beginners."
    expirationDate: "none"
    imageUrl: "www.fakeurl.com"
    issuedOn: "7/7/1917"
    credName: "Certification in Welding"
    ownerName: "Gary Oldman"
    schoolId: "1"
    studentEmail: "fakestudent@gmail.com"
    type: "Certificate"
  ) {
    id
    credHash
    txHash
  }
}
```

```json
{
  "data": {
    "addNewCredential": {
      "id": "4",
      "credHash": "0x8ae1d6e7efb7e492997844b76aa80b009a3d67f153ec09f119cfdb876d73d59d",
      "txHash": "0x36f54937d5c1dce9fa949f4fa8fee048e6e20a0fa9949b98e847262d649a7f6d"
    }
  }
}
```

## Data Models

#### Role

---

```
{
  id: ID
  type: String!
  users: [User]
}
```

#### USER

---

```
{
  id: ID
  username: String
  email: String!
  profilePicture: String
  roleId: ID
  sub: String!
  token: String
  tokenExpiration: Int
  role: Role
  schoolDetails: SchoolDetails
}
```

#### School Details

---

```
{
  id: ID
  name: String!
  taxId: String!
  street1: String
  street2: String
  city: String
  state: String
  zip: String
  type: String
  phone: String!
  url: String!
  userId: ID!
  user: User
  credentials: [Credential]
}
```

#### Credential

---

```
{
  id: ID
  credName: String!
  description: String!
  credHash: String
  txHash: String
  type: String!
  ownerName: String!
  studentEmail: String!
  imageUrl: String!
  criteria: String!
  valid: Boolean
  issuedOn: String!
  expirationDate: String
  schoolId: ID!
  schoolsUserInfo: User
}
```

## Query and Mutation List

#### Queries

- `getAllUsers` -> gets all users
- `getUserById(id: ID)` -> Gets a user by userId
- `getAllSchoolDetails` -> Gets all school details (for testing only)
- `getSchoolDetailsBySchoolId(id: ID)` -> Gets school details by schoolId
- `getAllCredentials` -> Gets all credentials
- `getCredentialById(id: ID)` -> Gets credential by credential ID
- `getCredentialsBySchoolId(id: ID)` -> Get all of a schools credentials
- `verifyCredential` -> Verifies a credential on the blockchain

#### Mutations

- `addUser( authToken: String! roleId: ID )` -> Adds a new user
- `updateUser( id: ID! username: String email: String roleId: ID )` -> Updates a users information
- `deleteUser(id: ID!)` -> Deletes a user by id
- `addSchoolDetail( name: String! taxId: String! street1: String street2: String city: String state: String zip: String type: String phone: String! url: String! userId: ID! )` -> Adds details for a school
- `updateSchoolDetail( id: ID! name: String taxId: String street1: String street2: String city: String state: String zip: String type: String phone: String url: String userId: ID )` -> Updates a schools details
- `addNewCredential( credName: String! description: String! txHash: String credHash: String type: String! ownerName: String! studentEmail: String! imageUrl: String! criteria: String! valid: Boolean issuedOn: String! expirationDate: String schoolId: ID! )` -> Adds a new credential to the database and blockchain
- `updateCredential( id: ID! credName: String description: String credHash: String txHash: String type: String ownerName: String studentEmail: String imageUrl: String criteria: String valid: Boolean issuedOn: String expirationDate: String schoolId: ID )` -> Updates a credential and reissues it on the blockchain
- `removeCredential(id: ID!): Credential invalidateCredential( id: ID! credName: String description: String credHash: String txHash: String type: String ownerName: String studentEmail: String imageUrl: String criteria: String valid: Boolean issuedOn: String expirationDate: String schoolId: ID )` -> Deletes a credential
- `validateCredential( id: ID! credName: String description: String credHash: String txHash: String type: String ownerName: String studentEmail: String imageUrl: String criteria: String valid: Boolean issuedOn: String expirationDate: String schoolId: ID )` Updates a credential to valid and reissues it on the blockchain

## Contributing and Getting Involved

If you spot a bug or would like to request a feature, we welcome and are grateful for any contributions from the community. Please review the process for contributing to this project by reading the [contribution guidelines](CONTRIBUTING.md).

Also, please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

#### Issue and Bug Requests

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

#### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Additional Documentation

See [Front-end Documentation](https://github.com/labs14-stampd/frontend) for details on the front-end client of our project.

## License

[MIT](LICENSE)

## Acknowledgements

- [Lambda School](https://lambdaschool.com/) - Thank you for educating us, equipping us with our current skillset, and pushing us towards success.
- [Josh Knell](https://github.com/BigKnell) - The Big Boss. The Big Cheese. Thanks for teaching us the basics and for keeping it real. Banjo on.
- [Dustin Myers](https://github.com/dustinmyers) - The Legend himself. Dustin is the reason we can even write a single line of code in React. Thanks for your leadership, Dustin.
- [Luis Hernandez](https://github.com/luishrd) - Luis, thanks for teaching us about the Bros and Homies. Your leadership in Lambda School back-end week lets us build servers and move mountains.
- [John Mitchell](https://github.com/jrmmba8314) - You opened up the statically-typed world of Java to us. Thank you for being a steady hand at the wheel when we needed it.
- [Dan Levy](https://danlevy.net/) - Thanks for all of your advice, Dan. You consistently come through with gold when we need it. Your advice is invaluable, and you care about students.
- [Coffee](https://en.wikipedia.org/wiki/Coffee) - We'd like to thank coffee for the productivity of this Labs project. Seriously. Thanks.
