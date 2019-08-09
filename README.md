# API Documentation

#### Backend delpoyed at [https://stampd-backend.herokuapp.com/](https://stampd-backend.herokuapp.com/) <br>

## Getting started

To get the server running locally:

- Clone this repo
- **yarn install** to install all required dependencies
- **yarn server** to start the local server
- **yarn test** to start server using testing environment

### GraphQL/Node/Express/PostgresQL

🚫 Why did you choose this framework?

- Point One
- Point Two
- Point Three
- Point Four

## How to use

Check [https://stampd-backend.herokuapp.com/playground](https://stampd-backend.herokuapp.com/playground) for full query and mutations list

Get school information through queries in GraphQL, example:

#### Queries

```javascript
{
  getSchoolDetailsBySchoolId(
    id: 1
  ){
    name
    street1
    street2
    city
    state
    zip
    type
    phone
    url
    user{
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

#### Mutations

```javascript
{
  addNewCredential (
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
  ){
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

# Data Model

#### Role

---

```
{
  id: ID
  type: String!
  users: [User]
}
```

#### USERS

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

## 2️⃣ Actions

`getAllUsers` -> gets all users
`getUserById(id: ID)` -> Gets a user by userId
`getAllSchoolDetails` -> Gets all school details (for testing only)
`getSchoolDetailsBySchoolId(id: ID)` -> Gets school details by schoolId
`getAllCredentials` -> Gets all credentials
`getCredentialById(id: ID)` -> Gets credential by credential ID
`getCredentialsBySchoolId(id: ID)` -> Get all of a schools credentials
`verifyCredential` -> Verifies a credential on the blockchain

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

🚫 These are just examples, replace them with the specifics for your app

_ STAGING_DB - optional development db for using functionality not available in SQLite
_ NODE\*ENV - set to "development" until ready for "production"

- JWT*SECRET - you can generate this by using a python shell and running import random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;*(-_=+)') for i in range(50)])
  _ SENDGRID_API_KEY - this is generated in your Sendgrid account \* stripe_secret - this is generated in the Stripe dashboard

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](🚫link to your frontend readme here) for details on the fronend of our project.
🚫 Add DS iOS and/or Andriod links here if applicable.
