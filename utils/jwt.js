const jwt = require('jsonwebtoken');

const jwtSecret = 'p@ssw0rd';

const generateToken = (id) => jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });

const verifyToken = (token) => jwt.verify(token.replace('Bearer ', ''), jwtSecret);
module.exports = { generateToken, verifyToken };
