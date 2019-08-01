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
    console.log('decoded');
    decodedToken = await jwt.verify(token, privateKey);
    console.log(decodedToken);
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
  console.log(req.roleId);
  req.userId = decodedToken.userId;
  next();
};
