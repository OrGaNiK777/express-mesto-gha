const router = require('express').Router();
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

router.get('/404', (req, res) => {
  res.status(404);
  return res.send({ message: 'Воу воу полегче' });
});

router.use(cardsRoutes);
router.use(usersRoutes);

module.exports = router;
