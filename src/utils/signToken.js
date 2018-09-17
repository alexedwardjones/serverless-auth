const jwt = require('jsonwebtoken');

module.exports = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
