const NotAuthError = require('../errors/not-auth-error');
const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new NotAuthError({ message: 'Необходима авторизация' }));
  }

  let payload;

  try {
    payload = verifyToken(authorization);
  } catch (err) {
    next(new NotAuthError({ message: 'Необходима авторизация' }));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
