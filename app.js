const express = require("express");
const bodyParser = require("body-parser");
//const routes = require("./routes/index");
const mongoose = require("mongoose");
const card = require("./models/card");
const user = require("./models/user");

const host = "localhost";

const { PORT = 5000 } = process.env;

const app = express();

app.use(express.static("build"));

mongoose
	.connect(`mongodb://localhost:27017/MestoDB`, {
		useNewUrlParser: true,
		family: 4,
	})
	.then(() => {
		console.log("Connected to DB");
	});

app.use(bodyParser.json());

//app.use(routes);

app.listen(PORT, host, () => {
	console.log(`Cервер запущен на http://${host}:${PORT}/`);
});

app.use((req, res, next) => {
	req.user = {
		_id: "648f4eceac33ebb800e0acee", // вставьте сюда _id созданного в предыдущем пункте пользователя
	};
	console.log(req.user._id);
	next();
});

app.get("/", (req, res) => {
	res.status(200);
	res.send("hello");
});

app.get("/users", (req, res) => {
	return user.find({}).then((user) => {
		return res.status(200).send(user);
	});
});

app.get("/users/:id", (req, res) => {
	const { id } = req.params;
	console.log(id);
	return user.findById(id).then((user) => {
		return res.status(200).send(user);
	});
});

app.post("/users", (req, res) => {
	const newUser = req.body;
	console.log(newUser);
	return user
		.create(newUser)
		.then((newUser) => {
			return res.status(201).send(newUser);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				return res.status(400).send({
					Message: `${Object.values(err.errors)
						.map((err) => err.message)
						.join(", ")}`,
				});
			}
			console.log("Ошибка добавления нового пользователя");
		});
});

app.patch("/users/me", (req, res) => {});

app.patch("/users/me/avatar", (req, res) => {});

app.get("/cards", (req, res) => {
	return card.find({}).then((cards) => {
		return res.status(200).send(cards);
	});
});

app.post("/cards", (req, res) => {
	const newCard = req.body;
	const { name, link } = req.body;
	const owner = req.user;
	console.log({ name, link, owner});
	return card
		.create({ name, link })
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
			console.log("Ошибка добавления новой карты");
		});
});

app.delete("/cards/:id", (req, res) => {
	const { id } = req.params;
	console.log(id);
	return card.findOneAndDelete(id).then((card) => {
		return res.status(200).send(card);
	});
});

app.put("/cards/:id/likes", (req, res) => {
	const { id } = req.params;
	console.log(id);
	card.findByIdAndUpdate(
		id,
		{ $addToSet: { likes: req.user._id } },
		{ new: true }
	).then((card) => {
		res.status(200).send(card);
	});
});

app.delete("/cards/:id/likes", (req, res) => {
	const { id } = req.params;
	console.log(id);
	card.findByIdAndUpdate(
		id,
		{ $pull: { likes: req.user._id } },
		{ new: true }
	).then((card) => {
		res.status(200).send(card);
	});
});
