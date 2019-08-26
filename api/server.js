const jwt = require('jsonwebtoken');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const UserEmails = require('../models/userEmailsModel');
const applyMiddleware = require('./middleware.js');
const schema = require('../schema/schema.js');
const secret = process.env.PK;
const server = express();
applyMiddleware(server);

server.get('/playground', expressPlayground({ endpoint: '/graphql' })); // Use GraphQL Playground

server.get('/', (req, res) => {
  res.send('The Stampd Server is alive and well 🎉');
});

server.get('/confirmation/:jwt', (req, res) => {
  try {
    const verified = jwt.verify(req.params.jwt, secret, async (err, result) => {
      if (err) {
        res.send({ error: err });
      } else {
        await UserEmails.update(result.subject, { valid: 'true' });
        res.status(200).json({ success: 'updated' });
      }
    });
  } catch (e) {
    res.send({ error: e });
  }
});

server.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: false // Turns off graphiql for GraphQL Playground use
  })
);

module.exports = server;
