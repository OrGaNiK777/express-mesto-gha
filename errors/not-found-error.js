// // 404 — объект не найден;\
const httpConstants = require('http2').constants;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTS_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
