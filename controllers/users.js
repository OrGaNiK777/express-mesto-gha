const httpConstants = require('http2').constants;
const bcrypt = require('bcrypt');

const User = require('../models/user');

const { generateToken } = require('../utils/jwt');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotAuthError = require('../errors/not-auth-error');

const saltRounds = 10;

const getUsers = (req, res, next) => User.find({})
  .then((user) => res.status(httpConstants.HTTP_STATUS_OK)
    .send(user)).catch(next);

function getCurrentUser(req, res, next) {
  const { id } = req.user;
  User.findById(id)
    .orFail(new NotFoundError(`Пользователь c id: ${id} не найден`))
    .then((user) => { res.status(httpConstants.HTTP_STATUS_OK).send(user); })
    .catch(next);
}

const getUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError(`Пользователь c id: ${req.params.id} не найден`))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return User.findOne({ email }).select('+password')
    .then((emailCheck) => {
      if (emailCheck) {
        next(new ConflictError('Пользователь уже существует'));
      }
      bcrypt.hash(password, saltRounds)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }));
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new NotAuthError('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password, (err, result) => {
        if (!result) { next(new NotAuthError('Не верный email или пароль')); }
        const token = generateToken(user._id);

        return res.status(httpConstants.HTTP_STATUS_OK).send({ token });
      });
    })
    .catch(next);
};

const patchUserById = (req, res, next) => {
  const newUser = req.body;
  const { id } = req.user;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError(`Пользователь по id  ${req.user._id} не найден`))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(' and ')}`));
      }
      next(err);
    })
    .catch(next);
};

const patchAvatarById = (req, res, next) => {
  const newUser = req.body;
  const { id } = req.user;
  return User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (!req.user) {
        next(new NotFoundError(`Пользователь по id  ${req.user._id} не найден`));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors)}`));
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
