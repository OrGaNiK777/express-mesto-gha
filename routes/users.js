const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUsersById,
  patchUserById,
  patchAvatarById,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUsersById);

router.post('/users', createUser);

router.patch('/users/me', patchUserById);

router.patch('/users/me/avatar', patchAvatarById);

module.exports = router;
