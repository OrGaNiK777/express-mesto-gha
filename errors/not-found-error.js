// 404 — объект не найден;\

const CODE_400_ERR = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODE_400_ERR;
  }
}

module.exports = NotFoundError;
