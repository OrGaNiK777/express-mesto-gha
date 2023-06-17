const router = require("express").Router();
const cardsRoutes = require("./cards");
const usersoutes = require("./users");

router.get("/", (req, res) => {
	res.status(200);
	res.send("hello");
});

router.use(cardsRoutes);
router.use(usersoutes);

module.exports = router;
