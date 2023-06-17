const cards = require("../cards.json");

const getCards = (req, res) => {
	res.status(200);
	res.send(cards);
};
const createCard = (req, res) => {
	const card = req.body;
	res.send("123");
	console.log(card);
};
const deleteCardById = (req, res) => {};
const likesCardById = (req, res) => {};

module.exports = { getCards, createCard, deleteCardById, likesCardById };
