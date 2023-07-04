const httpConstants = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/bad-request-error');

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
        throw new BadRequestError(
          `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        );
      }
      next(err);
    })
    .catch(next);
};

const deleteCardById = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return Card.findById(req.params.id)
      .orFail(() => new Error(`Карточка с _id ${req.params.id} не найдена`))
      .then((card) => {
        if (card.owner.toString() === req.user.id) {
          return Card.findByIdAndDelete(card._id)
            .orFail(() => new Error('С удалением что-то пошло не так'))
            .then((deletedCard) => res.send({ data: deletedCard, message: 'Карточка успешно удалена' }))
            .catch((err) => res.status(404).send({ error: err.message }));
        }
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      })
      .catch((err) => res.status(404).send({ error: err.message }));
  }
  return res.status(400).send({ error: 'Неверный формат id карточки' });
};

const putLikesCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.params.id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate(['likes', 'owner'])
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(`Карточка с id ${req.params.id} не  найдена`);
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
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  ).populate(['likes', 'owner'])
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError(`Карточка с id ${req.params.id} не найдена`);
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
