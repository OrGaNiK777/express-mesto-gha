const Card = require('../models/card');

const getCards = (req, res) => Card.find({}).then((cards) => res.status(200).send(cards));

const createCard = (req, res) => {
  // const newCard = req.body;
  const { name, link } = req.body;
  const owner = req.user;
  return Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(' and ')}`,
        });
      }
      return res.status(500).send(`${err.name}`);
    });
};

const deleteCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id, { new: true })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFoundById') {
        return res.status(404).send({
          Message: `Карточка с указаным id  ${id} не найдена`,
        });
      }
      return res.status(500).send(`${err.name}`);
    });
};

const putLikesCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: { _id: req.user._id } } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((cards) => { res.status(200).send(cards); })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для удаления лайка',
        });
      }
      if (err.name === 'NotFoundById') {
        return res.status(404).send({
          Message: `Карточка с указаным id ${id} не найдена`
          ,
        });
      }
      return res.status(500).send(`${err.name}`);
    });
};

const deleteLikesCardById = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: { _id: req.user._id } } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для удаления лайка',
        });
      }
      if (err.name === 'NotFoundById') {
        return res.status(404).send({
          Message: `Карточка с указаным id ${id} не найдена`
          ,
        });
      }
      return res.status(500).send(`${err.name}`);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikesCardById,
  deleteLikesCardById,
};
