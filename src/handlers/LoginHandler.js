const db = require('../database/db');
const User = require('../models/user')(db.sequelize, db.Sequelize);
const handleError = require('../utils/handleError');
const signToken = require('../utils/signToken');

module.exports = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return Promise.resolve(event)
    .then(loginUser)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(handleError);
};

function loginUser(eventBody) {
  return User.findOne({
      where: {
        email: eventBody.email
      }
    })
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