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

console.log(5);
const User = dbConnection => {
  console.log(name);
  console.log(attributes);
  console.log(dbConnection);
  return dbConnection.define(name, attributes);
};
console.log(6);
module.exports = User;
