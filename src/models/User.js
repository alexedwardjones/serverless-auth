const Sequelize = require('sequelize');

const name = 'user';

const attributes = {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
}; 

const User = dbConnection => {
  console.log(name);
  console.log(attributes);
  console.log(dbConnection);
  return dbConnection.define(name, attributes);
};

module.exports = User;
