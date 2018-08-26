const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');


const dbConnection = require('../../shared/database/connect');
const User = require('../../models/User');

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      register(JSON.parse(event.body))
    )
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message
    }));
};