const User = require('../models/user');

const getUsers = (req, res) => User.find({}).then((user) => {
  if (!req.user._id) {
    return res
      .status(404)
      .send(`Пользователь по id  ${req.user._id} не найден`);
  }
  return res.status(200).send(user);
});

const getUsersById = (req, res) => {
  // const { id } = req.params;
  User.findById(req.user._id)
    .then((user) => {
      if (!req.user._id) {
        return res
          .status(404)
          .send(`Пользователь по id  ${req.user._id} не найден`);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send(`${err.name}`);
    });
};

const createUser = (req, res) => {
  const newUser = req.body;
  // console.log(newUser);
  return User.create(newUser)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(500).send(`${err.name}`);
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
        return res
          .status(404)
          .send(`Пользователь по id  ${req.user._id} не найден`);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(500).send(`${err.name}`);
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
        return res
          .status(404)
          .send(`Пользователь по id  ${req.user._id} не найден`);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(500).send(`${err.name}`);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
  patchUserById,
  patchAvatarById,
};
