const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUsersById,
  patchUserById,
  patchAvatarById,
  login,
} = require('../controllers/users');

router.get('/users/me', getUsers);

router.get('/users/:id', getUsersById);

router.patch('/users/me', patchUserById);

router.patch('/users/me/avatar', patchAvatarById);

router.post('/signup', createUser);

router.post('/signin', login);

module.exports = router;
