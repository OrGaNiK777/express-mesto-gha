const httpConstants = require('http2').constants;
const bcrypt = require('bcrypt');

const User = require('../models/user');

const { generateToken } = require('../utils/jwt');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotAuthError = require('../errors/not-auth-error');
const ForbiddenError = require('../errors/forbidden-error');

const saltRounds = 10;

const getUsers = (req, res, next) => User.find({})
  .then((user) => res.status(httpConstants.HTTP_STATUS_OK)
    .send(user)).catch((err) => { throw new Error(err).catch(next); });

function getCurrentUser(req, res, next) {
  const { id } = req.user;
  User.findById(id)
    .then((user) => { res.status(httpConstants.HTTP_STATUS_OK).send(user); })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(`Пользователь c id: ${id} не найден`);
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
}

const getUsersById = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(`Пользователь c id: ${id} не найден`);
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) { throw new BadRequestError('Не передан email или пароль'); }
  return User.findOne({ email }).select('+password')
    .then((emailCheck) => {
      if (emailCheck) {
        throw new ConflictError('Пользователь уже существует');
      }
      return bcrypt.hash(password, saltRounds, (err1, hash) => User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError({ message: `${Object.values(err.errors).map((error) => error.message).join(' and ')}` });
          }
          return next(err);
        }));
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) { throw new BadRequestError('Не передан email или пароль'); }
  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new ForbiddenError('Пользователь не найден');
      }
      return bcrypt.compare(password, user.password, (err, result) => {
        if (!result) { throw new NotAuthError('Не верный email или пароль'); }
        const token = generateToken(user._id);

        return res.status(httpConstants.HTTP_STATUS_OK).send({ token });
      });
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
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (!req.user) {
        throw new NotFoundError(`Пользователь по id  ${req.user._id} не найден`);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError({
          message:
            `${Object.values(err.errors)}`,
        });
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
  login,
  getCurrentUser,
};
