const Sequelize = require('sequelize');

const dbConnection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false,
  logging: console.log,
});

module.exports = dbConnection;
