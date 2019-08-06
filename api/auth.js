require('dotenv').config();
const jwt = require('jsonwebtoken');

const privateKey = process.env.PK;

module.exports = async (req, res, next) => {
  const token = req.get('Authorization');
  if (!token) {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, privateKey);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.roleId = decodedToken.roleId;
  req.userId = decodedToken.userId;
  return next();
};
