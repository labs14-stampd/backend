// An object containing string constants to be used for uniform error messages
module.exports = {
  GENERIC: 'There was an error completing the request:\n',
  MISSING_PARAMETER: {
    EMAIL_ADDRESS: 'Please include an email address and try again',
    CREDENTIAL_ID: 'Please include a credential ID and try again',
    SCHOOLDETAIL: {
      ID: 'Please include a school ID and try again',
      NAME: 'Please include a name for the school',
      TAX_ID: 'Please include a tax ID for the school',
      PHONE: 'Please include a phone number for the school',
      URL: 'Please include a URL for the school'
    },
    USER: {
      ID: 'Please include a user ID and try again'
    }
  },
  NOT_FOUND: {
    CREDENTIAL: 'Credential with the given ID could not be found',
    SCHOOLDETAIL: 'School details with the given ID could not be found',
    USER: 'User with the given ID could not be found'
  },
  NOT_UNIQUE: {
    GENERIC: 'Please ensure that provided values are unique as required',
    SCHOOLDETAIL: {
      NAME: 'School name must be unique',
      TAX_ID: 'Tax ID must be unique'
    }
  },
  UNAUTHORIZED: 'Unauthorized'
};
