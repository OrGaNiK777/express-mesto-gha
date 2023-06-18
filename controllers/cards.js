// const card = require("../models/card");

// const getCards = (req, res) => {
// 	return card.find({}).then((cards) => {
// 		return res.status(200).send(cards);
// 	});
// };
// const createCard = (req, res) => {
// 	const newCard = req.body;
// 	console.log(newCard);
// 	return card
// 		.create(newCard)
// 		.then((newCard) => {
// 			return res.status(201).send(newCard);
// 		})
// 		.catch((err) => {
// 			if (err.name === "ValidationError") {
// 				return res.status(400).send({
// 					Message: `${Object.values(err.errors)
// 						.map((err) => err.message)
// 						.join(", ")}`,
// 				});
// 			}
// 			// if (err.link === "ValidationError") {
// 			// 	return res
// 			// 		.status(400)
// 			// 		.send({ Message: "Поле ссылка не должно быть пустым" });
// 			// }
// 			console.log("Ошибка добавления новой карты");
// 		});
// };
// const deleteCardById = (req, res) => {
// 	const { id } = req.params;
// 	console.log(id);
// 	return card.findOneAndDelete(id).then((card) => {
// 		return res.status(200).send(card);
// 	});
// };
// const likesCardById = (req, res) => {};

// module.exports = { getCards, createCard, deleteCardById, likesCardById };
