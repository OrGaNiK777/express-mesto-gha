const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema([
	{
		name: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 30,
		},
		link: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		likes: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "user",
				},
			],
			default: [],
		},
		owner: {
			// type: mongoose.Schema.Types.ObjectId,
			// ref: "user",
			// required: true,
			_id: { type: String },
		},
	},
]);

module.exports = mongoose.model("card", cardSchema);

//const mongoose = require("mongoose");

// const cardSchema = new mongoose.Schema({
// 	createdAt: {
// 		type: String,
// 	},
// 	likes: {
// 		type: Array,
// 	},
// 	link: {
// 		type: String,
// 		required: true,
// 	},
// 	name: {
// 		minlength: 2,
// 		maxlength: 30,
// 		type: String,
// 		required: true,
// 	},
// 	owner: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: "user",
// 		required: true,
// 	},
// });

// module.exports = mongoose.model("card", cardSchema);
