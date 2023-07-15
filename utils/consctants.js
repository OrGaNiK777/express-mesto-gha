const host = '127.0.0.1';

const { PORT = 5000 } = process.env;

const saltRounds = 10;

const jwtSecret = 'p@ssw0rd';

module.exports = {
  host, PORT, saltRounds, jwtSecret,
};
