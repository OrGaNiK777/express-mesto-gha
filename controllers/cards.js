const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');// 404
const BadRequestError = require('../errors/bad-request-error');// 400

const getCards = (req, res) => Card.find({}).populate(['likes', 'owner']).then((cards) => res.status(200).send(cards));

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
      next(err);
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
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для удаления карточки',
        );
      }
      next(err);
    })
    .catch(next);
};
const putLikesCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate(['likes', 'owner']) // не совсем понимаю как это работает
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указаным id не найдена');
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(
          'Переданы некорректные данные для постановки лайка',
        );
      }
      // next(err);
    });
  // .catch(next);
};

const deleteLikesCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).populate(['likes', 'owner'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указаным id не найдена');
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления лайка');
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikesCardById,
  deleteLikesCardById,
};
