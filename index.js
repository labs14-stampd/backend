const server = require('./api/server.js');
const Sentry = require('@sentry/node');
require('dotenv').config();

Sentry.init({
  dsn: process.env.NODE_SERVER_SENTRY
});

const port = process.env.PORT || 8000;
server.listen(port, () =>
  console.log(`
--------------------------------------------------------------
          Server is live on http://localhost:${port}

GraphQL Playground is live on http://localhost:${port}/playground
--------------------------------------------------------------
  `)
);
