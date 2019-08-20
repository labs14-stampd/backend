const express = require('express');
const graphqlHTTP = require('express-graphql');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const applyMiddleware = require('./middleware.js');
const schema = require('../schema/schema.js');
const sendMail = require('../utils/sendMail.js');

const server = express();

applyMiddleware(server);

server.get('/playground', expressPlayground({
  endpoint: '/graphql'
})); // Use GraphQL Playground

server.get('/', (req, res) => {
  res.send('The Stampd Server is alive and well 🎉');
});

server.post('/confirmation/:testParam', (req, res) => {
  console.log(req.params.testParam)
  sendMail.sendMail({
    recipientName: 'Waldo pepper',
    recipientEmail: req.params.testParam
  });
  res.send('Email attempted');
})

server.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: false // Turns off graphiql for GraphQL Playground use
  })
);

module.exports = server;