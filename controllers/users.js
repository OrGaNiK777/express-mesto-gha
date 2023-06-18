// const user = require("../models/user");


// const getUsers = (req, res) => {
// 	return user.find({}).then((user) => {
// 		return res.status(200).send(user);
// 	});
// };

// const getUsersById = (req, res) => {
// 	const { id } = req.params;
// 	console.log(id);
// 	return user.findById(id).then((user) => {
// 		return res.status(200).send(user);
// 	});
// };

// const createUser = (req, res) => {
// 	const newUser = req.body;
// 	console.log(newUser);
// 	return user
// 		.create(newUser)
// 		.then((newUser) => {
// 			return res.status(201).send(newUser);
// 		})
// 		.catch((err) => {
// 			if (err.name === "ValidationError") {
// 				return res.status(400).send({
// 					Message: `${Object.values(err.errors)
// 						.map((err) => err.message)
// 						.join(", ")}`,
// 				});
// 			}
// 			console.log("Ошибка добавления нового пользователя");
// 		});
// };

// const patchUserById = (req, res) => {};

// const patchAvatarById = (req, res) => {};

// module.exports = {
// 	getUsers,
// 	createUser,
// 	getUsersById,
// 	patchUserById,
// 	patchAvatarById,
// };
