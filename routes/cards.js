const router = require("express").Router();

const {
	getCards,
	createCard,
	deleteCardById,
	likesCardById,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards", deleteCardById);
router.patch("/cards", likesCardById);

module.exports = router;
