// An object containing string constants to be used for uniform error messages
module.exports = {
  GENERIC: 'There was an error in completing the request\n',
  INVALID_LOGIN: 'Invalid login - an authentication error occurred',
  MISSING_PARAMETER: {
    AUTH_TOKEN: 'Authentication token missing or invalid.',
    EMAIL_ADDRESS: 'Please include an email address and try again',
    CREDENTIAL_ID: 'Please include a credential ID and try again',
    SCHOOLDETAIL: {
      ID: 'Please include a school ID and try again',
      NAME: 'Please include a name for the school',
      TAX_ID: 'Please include a tax ID for the school',
      PHONE: 'Please include a phone number for the school',
      URL: 'Please include a URL for the school'
    },
    STUDENTDETAIL: {
      ID: 'Please include a student ID and try again'
    },
    USER: {
      ID: 'Please include a user ID and try again'
    },
    USEREMAIL: {
      ID: 'Please include an email ID and try again',
      EMAIL: 'Please include an email address and try again'
    }
  },
  NOT_FOUND: {
    CREDENTIAL: 'Credential with the given ID could not be found',
    SCHOOLDETAIL: 'School with the given ID could not be found',
    STUDENTDETAIL: 'Student with the given ID could not be found',
    ROLE: 'No role corresponding to the given ID exists',
    USER: 'User with the given ID could not be found',
    USEREMAIL: 'Email address with the given ID could not be found'
  },
  NOT_UNIQUE: {
    EMAIL_ADDRESS: 'Email address is already taken',
    GENERIC: 'Please ensure that provided values are unique as required',
    SCHOOLDETAIL: {
      NAME: 'School name already exists in the records',
      TAX_ID: 'Tax ID already exists in the records'
    },
    USER: {
      USERNAME: 'Username is already taken',
      SUB: 'An error occurred when attempting to add the new user' // Purposefully ambiguous for security reasons
    }
  },
  UNAUTHORIZED: 'Unauthorized'
};
