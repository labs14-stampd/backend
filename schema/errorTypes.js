// An object containing string constants to be used for uniform error messages
module.exports = {
  GENERIC: 'There was an error completing the request:\n',
  MISSING_PARAMETER: {
    EMAIL_ADDRESS: 'Please include an email address and try again',
    CREDENTIAL_ID: 'Please include a credential ID and try again',
    SCHOOLDETAILS_ID: 'Please include a school ID and try again',
    USER_ID: 'Please include a user ID and try again'
  },
  NOT_FOUND: {
    CREDENTIAL: 'Credential with the given ID could not be found',
    SCHOOLDETAILS: 'School details with the given ID could not be found',
    USER: 'User with the given ID could not be found'
  },
  UNAUTHORIZED: 'Unauthorized'
};
