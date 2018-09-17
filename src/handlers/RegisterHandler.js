const bcrypt = require('bcryptjs-then');

const db = require('../database/db');
const User = require('../models/user')(db.sequelize, db.Sequelize);
const handleError = require('../utils/handleError');
const signToken = require('../utils/signToken');

module.exports = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return Promise.resolve(event)
    .then(registerUser)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(handleError);
};

function registerUser(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    .then(() => User.findOne({
        where: {
          email: eventBody.email
        }
      })
    )
    .then(user => user
        ? Promise.reject(new Error('User with that email exists.'))
        : bcrypt.hash(eventBody.password, 8)
      )
    .then(hash => User.create({ username: eventBody.username, email: eventBody.email, password: hash }))
    .then(user => ({ auth: true, token: signToken(user._id) }));
}

function checkIfInputIsValid(eventBody) {
  if (
    !(eventBody.password &&
      eventBody.password.length >= 7)
  ) {
    return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));
  }

  if (
    !(eventBody.username &&
      typeof eventBody.username === 'string')
  ) return Promise.reject(new Error('Username error.'));

  if (
    !(eventBody.email &&
      typeof eventBody.email === 'string')
  ) return Promise.reject(new Error('Email error.'));

  return Promise.resolve();
}