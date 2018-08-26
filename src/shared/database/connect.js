const Sequelize = require('sequelize');

const dbConnection = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});

export default dbConnection;
