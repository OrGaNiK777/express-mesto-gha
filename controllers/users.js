const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');// 404
const BadRequestError = require('../errors/bad-request-error');// 400

const getUsers = (req, res) => User.find({}).then((user) => res.status(200).send(user));

const getUsersById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (!User) { throw new NotFoundError(`Пользователь c id: ${id} не найден`); }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    });
};

const createUser = (req, res) => {
  const newUser = req.body;
  return User.create(newUser)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' and ')}`);
      }
    });
};

const patchUserById = (req, res) => {
  const newUser = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!req.user._id) {
        throw new NotFoundError(`Пользователь по id  ${req.user._id} не найден`);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' and ')}`);
      }
    });
};

const patchAvatarById = (req, res) => {
  const newUser = req.body;
  const id = req.user._id;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!req.user._id) {
        throw new NotFoundError(`Пользователь по id  ${req.user._id} не найден`);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          `${Object.values(err.errors)}`,
        );
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
  patchUserById,
  patchAvatarById,
};
