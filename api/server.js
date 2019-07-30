const express = require('express');
const applyMiddleware = require('./middleware.js');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema.js');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const server = express();

applyMiddleware(server);

server.get('/playground', expressPlayground({ endpoint: '/graphql' })); // Use GraphQL Playground

server.get('/', (req, res) => {
  res.send('The Stampd Server is alive and well 🎉');
});

server.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: false // Turns off graphiql for GraphQL Playground use
  })
);

module.exports = server;
