const httpConstants = require('http2').constants;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getUsers = (req, res) => User.find({}).then((user) => res.status(httpConstants.HTTP_STATUS_OK)
  .send(user)).catch((err) => { throw new Error(err); });

const getUsersById = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') { throw new NotFoundError(`Пользователь c id: ${id} не найден`); }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const newUser = req.body;
  return User.create(newUser)
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' and ')}`);
      } return new Error(err.name);
    })
    .catch(next);
};

const patchUserById = (req, res, next) => {
  const newUser = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(`Пользователь по id  ${req.user._id} не найден`);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' and ')}`);
      } return new Error(err.name);
    })
    .catch(next);
};

const patchAvatarById = (req, res, next) => {
  const newUser = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (!req.user._id) {
        throw new NotFoundError(`Пользователь по id  ${req.user._id} не найден`);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          `${Object.values(err.errors)}`,
        );
      } return new Error(err.name);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
  patchUserById,
  patchAvatarById,
};
