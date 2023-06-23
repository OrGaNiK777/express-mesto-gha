//const statusCodes = require('http').STATUS_CODES;
const httpConstants = require('http2').constants;

const CODE_200_OK = httpConstants.HTTP_STATUS_OK;
const CODE_201_CREATED = httpConstants.HTTP_STATUS_CREATED;
const CODE_400_BAD_REQUEST = httpConstants.HTTP_STATUS_BAD_REQUEST;
const CODE_404_NOT_FOUND = httpConstants.HTTP_STATUS_NOT_FOUND;
const CODE_500_SERVER_ERROR = httpConstants.HTTP_STATUS_SERVER_ERROR;

module.exports = {
  CODE_200_OK, CODE_201_CREATED, CODE_400_BAD_REQUEST, CODE_404_NOT_FOUND, CODE_500_SERVER_ERROR,
};
