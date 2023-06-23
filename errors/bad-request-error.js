// eslint-disable-next-line max-len
// // 400 — переданы некорректные данные в метод создания карточки, пользователя, обновления аватара пользователя и профиля
const httpConstants = require('http2').constants;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
