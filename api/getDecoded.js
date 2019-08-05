const decode = require('jwt-decode');

const getDecoded = token => {
  let decodedToken = '';

  if (token) {
    decodedToken = decode(token, process.env.REACT_APP_AUTH_TOKEN);
  }

  return decodedToken || null;
};

module.exports = getDecoded;
