const card = require("../models/card");

const getCards = (req, res) => {
	return card.find({}).then((cards) => {
		return res.status(200).send(cards);
	});
};

const createCard = (req, res) => {
	//const newCard = req.body;
	const { name, link } = req.body;
	const owner = req.user;
	return card
		.create({ name, link, owner })
		.then((newCard) => {
			return res.status(201).send(newCard);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				return res.status(400).send({
					Message: `${Object.values(err.errors)
						.map((err) => err.message)
						.join(", ")}`,
				});
			}
			// if (err.name === "CastError") {
			// 	return res.status(400).send({
			// 		message: "Переданы некорректные данные создания карточки",
			// 	});
			// }
			return res.status(500).send(`${err.name}`);
		});
};

const deleteCardById = (req, res) => {
	const { id } = req.params;
	card.findByIdAndRemove(id, { new: true })
		.then((card) => {
			return res.status(200).send(card);
		})

		.catch((err) => {
			console.log("ошибка удаления карточки");
			if (err.message === "NotFoundById") {
				return res.status(404).send({
					Message: `Карточка с указаным id  ${id} не найдена`,
				});
			}
		});
};

const putLikesCardById = (req, res) => {
	const { id } = req.params;
	card.findByIdAndUpdate(
		id,
		{ $addToSet: { likes: req.user._id } },
		{ new: true }
	)
		.then((card) => {
			return res.status(200).send(card);
		})
		.catch((err) => {
			if (err.name === "CastError") {
				return res.status(400).send({
					message:
						"Переданы некорректные данные для постановки лайка",
				});
			}
			if (err.message === "NotFoundById") {
				return res.status(404).send({
					Message: `Карточка с указаным id  ${id} не найдена`,
				});
			}
		});
};

const deleteLikesCardById = (req, res) => {
	const { id } = req.params;
	console.log(req.user._id);
	card.findByIdAndUpdate(
		id,
		{ $pull: { likes: req.user._id } },
		{ new: true }
	)
		.then((card) => {
			return res.status(200).send(card);
		})
		.catch((err) => {
			if (err.name === "CastError") {
				return res.status(400).send({
					message: "Переданы некорректные данные для удаления лайка",
				});
			}
			if (err.message === "NotFoundById") {
				return res.status(404).send({
					Message: `Карточка с указаным id  ${id} не найдена`,
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
