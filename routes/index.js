const router = require('express').Router();
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

router.get('/', (req, res) => {
  res.status(200);
  res.send('hello');
});

router.use(cardsRoutes);
router.use(usersRoutes);

module.exports = router;
