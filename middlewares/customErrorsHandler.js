const httpConstants = require('http2').constants;

module.exports = (error, req, res, next) => {
  const { statusCode = httpConstants.HTTP_STATUS_SERVER_ERROR, message } = error;
  res.status(statusCode).send({ message: statusCode === httpConstants.HTTP_STATUS_SERVER_ERROR ? `Ой ${next.name}` : message });
  next();
};
