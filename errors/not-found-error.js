// 404 — объект не найден
const CODE_404_ERR = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODE_404_ERR;
  }
}

module.exports = NotFoundError;
