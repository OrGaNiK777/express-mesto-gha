const httpConstants = require('http2').constants;
const Card = require('../models/card');
// Я убрал все это нагромождение начал теряться

const getCards = (req, res) => Card.find({}).populate(['likes', 'owner'])
  .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
  .catch((err) => { throw new Error(err); });

const createCard = (req, res) => {
  // const newCard = req.body;
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message:
            `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

const deleteCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({
          message:
            'Карточка с указаным id не найдена',
        });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные для удаления карточки',
        });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};
const putLikesCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate(['likes', 'owner']) // не совсем понимаю как это работает
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указаным id не  найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные для постановки лайка',
        });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

const deleteLikesCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).populate(['likes', 'owner'])
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указаным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления лайка' });
      }
      return res.status(httpConstants.HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikesCardById,
  deleteLikesCardById,
};
