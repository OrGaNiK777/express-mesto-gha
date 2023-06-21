const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');// 404
const BadRequestError = require('../errors/bad-request-error');// 400

const getUsers = (req, res) => User.find({}).then((user) => res.status(200).send(user));

const getUsersById = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) { throw new NotFoundError(`Пользователь c id: ${id} не найден`); }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const newUser = req.body;
  return User.create(newUser)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' and ')}`);
      }
      next(err);
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
      next(err);
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
      next(err);
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
