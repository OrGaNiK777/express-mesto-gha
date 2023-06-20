const Card = require('../models/card');

const getCards = (req, res) => Card.find({}).populate(['likes', 'owner']).then((cards) => res.status(200).send(cards));

const createCard = (req, res) => {
  // const newCard = req.body;
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(' and ')}`,
        });
      }
      return res.status(500).send({ message: `Ой ${err.name}` });
    });
};

const deleteCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка с указаным id не найдена',
        });
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
      }
      return res.status(500).send({ message: `Ой ${err.name}` });
    });
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
        return res.status(404).send({
          message: 'Карточка с указаным id не найдена',
        });
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res.status(500).send({ message: `Ой ${err.name}` });
    });
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
        return res.status(404).send({
          message: 'Карточка с указаным id не найдена',
        });
      } return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для удаления лайка',
        });
      }
      return res.status(500).send({ message: `Ой ${err.name}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikesCardById,
  deleteLikesCardById,
};
