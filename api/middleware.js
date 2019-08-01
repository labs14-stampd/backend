const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const isAuth = require('./auth.js');
const morgan = require('morgan');

module.exports = server => {
  server.use(express.json());
  server.use(cors());
  server.use(helmet());
  server.use(isAuth);
  // server.use(morgan('dev')); // Turned off in playground mode due to excessive GraphQL logging
};
