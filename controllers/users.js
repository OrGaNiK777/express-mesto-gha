const httpConstants = require('http2').constants;
const User = require('../models/user');
// Я убрал все это нагромождение начал теряться

const getUsers = (req, res) => User.find({})
  .then((user) => { res.status(httpConstants.HTTP_STATUS_OK).send(user); })
  .catch((err) => { throw new Error(err); });

const getUsersById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь c id: ${id} не найден` });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const newUser = req.body;
  return User.create(newUser)
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

const patchUserById = (req, res) => {
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
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по id  ${req.user._id} не найден` });
      }
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

const patchAvatarById = (req, res) => {
  const newUser = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (!req.user._id) {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по id  ${req.user._id} не найден` });
      }
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message:
            `${Object.values(err.errors)}`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
  patchUserById,
  patchAvatarById,
};
