const decode = require('jwt-decode');

const getLoginStatus = token => {
  let decodedToken = '';

  if (token) {
    decodedToken = decode(token);
  }

  return decodedToken.sub || null;
};

module.exports = getLoginStatus;
