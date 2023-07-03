const httpConstants = require('http2').constants;

module.exports = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({ message: statusCode === httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Произошла ошибка сервера' : message });
  next();
};
