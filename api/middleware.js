const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const isAuth = require('./auth.js');

module.exports = server => {
  server.use(express.json());
  server.use(cors());
  server.use(helmet());
  server.use(isAuth);
};
