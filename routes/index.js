const router = require('express').Router();
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');
const NotFoundError = require('../errors/not-found-error');

router.use(cardsRoutes);
router.use(usersRoutes);

router.use('/*', () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = router;
