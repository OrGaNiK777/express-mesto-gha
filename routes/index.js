const router = require('express').Router();
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

router.use('*', (req, res) => {
  res.status(404);
  return res.send({ message: 'Запрашиваемый ресурс не найден' });
});

router.use(cardsRoutes);
router.use(usersRoutes);

module.exports = router;
