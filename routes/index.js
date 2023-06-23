const httpConstants = require('http2').constants;
const router = require('express').Router();
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

router.use(cardsRoutes);
router.use(usersRoutes);

router.use('/*', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND);
  return res.send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
