const CODE_500_ERR = require('../utils/constants');

module.exports = (error, req, res, next) => {
  const { statusCode = CODE_500_ERR, message } = error;
  res.status(statusCode).send({ message: statusCode === CODE_500_ERR ? 'Ой' : message });
  next();
};
