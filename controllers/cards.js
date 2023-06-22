const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');// 404
const BadRequestError = require('../errors/bad-request-error');// 400
const CODE_200_OK = require('../utils/constants');

const getCards = (req, res) => Card.find({}).populate(['likes', 'owner']).then((cards) => res.status(CODE_200_OK).send(cards))
  .catch((err) => { throw new Error(err); });

const createCard = (req, res, next) => {
  // const newCard = req.body;
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          `${Object.values(err.errors).map((error) => error.message).join(' and ')}`,
        );
      }
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          'Карточка с указаным id не найдена',
        );
      } return res.status(CODE_200_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для удаления карточки',
        );
      }
    })
    .catch(next);
};
const putLikesCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate(['likes', 'owner']) // не совсем понимаю как это работает
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указаным id не найдена');
      } return res.status(CODE_200_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для постановки лайка',
        );
      }
    })
    .catch(next);
};

const deleteLikesCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).populate(['likes', 'owner'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указаным id не найдена');
      } return res.status(CODE_200_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления лайка');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikesCardById,
  deleteLikesCardById,
};
