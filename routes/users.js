const router = require('express').Router();

const {
  getUsers,
  getUsersById,
  patchUserById,
  patchAvatarById,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:id', getUsersById);

router.patch('/users/me', patchUserById);

router.patch('/users/me/avatar', patchAvatarById);

module.exports = router;
