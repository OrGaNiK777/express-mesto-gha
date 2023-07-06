const httpConstants = require('http2').constants;
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => Card.find({}).populate(['likes', 'owner'])
  .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(
          `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        ));
      } else
        next(err);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new NotFoundError(`Карточка с id ${req.params.id} не найдена`))
    .then((card) => {
      if (card.owner.toString() === req.user.id) {
        return Card.deleteOne(card._id)
          .orFail(() => new Error('С удалением что-то пошло не так'))
          .then(res.status(httpConstants.HTTP_STATUS_OK).send({ message: 'Карта удалена' }));
      }
      return next(new ForbiddenError('Вы не можете удалять чужие карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      }
      next(err);
    })
    .catch(next);
};

const putLikesCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.params.id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate(['likes', 'owner'])
    .orFail(new NotFoundError(`Карточка с id ${req.params.id} не  найдена`))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(
          'Переданы некорректные данные для постановки лайка',
        ));
      }
      next(err);
    })
    .catch(next);
};

const deleteLikesCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  ).populate(['likes', 'owner'])
    .orFail(new NotFoundError(`Карточка с id ${req.params.id} не найдена`))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
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
