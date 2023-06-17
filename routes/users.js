const router = require("express").Router();

const {
	getUsers,
	createUserById,
	createAvatarById,
} = require("../controllers/users");

router.get("/users/me", getUsers);

router.patch("/users/me", createUserById);

router.patch("/users/me/avatar", createAvatarById);

module.exports = router;
