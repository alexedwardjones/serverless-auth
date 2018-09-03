const donotinclude = require('../../donotinclude.json');

console.log(donotinclude);

console.log('HERE2');

module.exports = {
  development: {
    username: donotinclude.DB_USER,
    password: donotinclude.DB_PASSWORD,
    database: donotinclude.DB_NAME,
    host: donotinclude.DB_HOST,
    dialect: 'postgres'
  },
};