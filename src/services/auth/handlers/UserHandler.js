const dbConnection = require('../../../shared/database/connect');
const User = require('../../../models/User');

module.exports.getUsers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return fetchUsers()
    .then(users => ({
      statusCode: 200,
      body: JSON.stringify(users)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};

function fetchUsers() {
  return User.findAll({})
    .then(users => {
      console.log(users);
      return users;
    })
    .catch(err => Promise.reject(new Error(err)));
}