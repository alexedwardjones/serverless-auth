const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

console.log(1);
const dbConnection = require('../../../shared/database/dbConnection');
console.log(2);
console.log(dbConnection);
const User = require('../../../models/User')(dbConnection);
console.log(3);

module.exports.register = (event, context) => {
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false;
  return register(JSON.parse(event.body))
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

module.exports.login = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return login(JSON.parse(event.body))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

module.exports.me = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
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

function register(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    .then(() =>
      User.findOne({ email: eventBody.email }) // check if user exists
    )
    .then(user =>
      user
        ? Promise.reject(new Error('User with that email exists.'))
        : bcrypt.hash(eventBody.password, 8) // hash the pass
    )
    .then(hash =>
      User.create({ username: eventBody.username, email: eventBody.email, password: hash }) 
      // create the new user
    )
    .then(user => ({ auth: true, token: signToken(user._id) })); 
    // sign the token and send it back
}

function login(eventBody) {
  return User.findOne({ email: eventBody.email })
    .then(user =>
      !user
        ? Promise.reject(new Error('User with that email does not exits.'))
        : comparePassword(eventBody.password, user.password, user._id)
    )
    .then(token => ({ auth: true, token: token }));
}

function comparePassword(eventPassword, userPassword, userId) {
  return bcrypt.compare(eventPassword, userPassword)
    .then(passwordIsValid =>
      !passwordIsValid
        ? Promise.reject(new Error('The credentials do not match.'))
        : signToken(userId)
    );
}

function me(userId) {
  return User.findById(userId, { password: 0 })
    .then(user =>
      !user
        ? Promise.reject('No user found.')
        : user
    )
    .catch(err => Promise.reject(new Error(err)));
}