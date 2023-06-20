const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  deleteLikesCardById,
  putLikesCardById,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:id', deleteCardById);

router.delete('/cards/:id/likes', deleteLikesCardById);

router.put('/cards/:id/likes', putLikesCardById);

module.exports = router;
