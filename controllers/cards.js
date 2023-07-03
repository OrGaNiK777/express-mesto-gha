const httpConstants = require('http2').constants;
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = (req, res, next) => Card.find({}).populate(['likes', 'owner'])
  .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        );
      }
      next(err);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(
          'Карточка с указаным id не найдена',
        );
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления карточки');
      }
      next(err);
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
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточка с указаным id не  найдена');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для постановки лайка',
        );
      }
      next(err);
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
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточка с указаным id не найдена');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления лайка');
      }
      next(err);
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
