const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const mongoose = require("mongoose");

const host = "localhost";

const { PORT = 5000 } = process.env;

mongoose
	.connect(`mongodb://localhost:27017/MestoDB`, {
		useNewUrlParser: true,
		family: 4,
	})
	.then(() => {
		console.log("Connected to DB");
	});

const app = express();

app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, host, () => {
	console.log(`Cервер запущен на http://${host}:${PORT}/`);
});
