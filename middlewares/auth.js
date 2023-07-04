const NotAuthError = require('../errors/not-auth-error');
const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new NotAuthError('Необходима авторизация');
  }

  let payload;

  try {
    payload = verifyToken(authorization);
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
