const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = 'p@ssw0rd';

const generateToken = (id) => jwt.sign({ id }, jwtSecret);

const verifyToken = (token) => jwt.verify(token.replace('Bearer ', ''), jwtSecret, (err, decoded) => {
  if (err) return false;
  return User.findById(decoded.id)
    .then((user) => Boolean(user));
});

module.exports = { generateToken, verifyToken };
