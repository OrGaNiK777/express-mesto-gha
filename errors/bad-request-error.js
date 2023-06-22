// eslint-disable-next-line max-len
// 400 — переданы некорректные данные в метод создания карточки, пользователя, обновления аватара пользователя и профиля

const CODE_400_ERR = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODE_400_ERR;
  }
}

module.exports = BadRequestError;
