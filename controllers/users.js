const user = require("../models/user");

const getUsers = (req, res) => {
	return user.find({}).then((users) => {
		return res.status(200).send(users);
	});
};

const createUserById = (req, res) => {};

const createAvatarById = (req, res) => {};

module.exports = { getUsers, createUserById, createAvatarById };
