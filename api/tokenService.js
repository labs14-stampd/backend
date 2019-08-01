const jwt = require('jsonwebtoken');

const secret = process.env.PK;

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
    roleId: user.roleId
  };

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, secret, options);
}

module.exports = generateToken;
