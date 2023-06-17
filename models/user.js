const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
	},
	about: {
		type: String,
		required: true,
		minlength: 3,
	},
	avatar: {
		type: String,
		required: true,
	},
	_id: {
		type: String,
		required: true,
	},
	cohort: { type: String, required: true },
});

module.exports = mongoose.model("user", userSchema);
