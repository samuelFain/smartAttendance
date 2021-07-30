const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
	successful: {
		type: Number,
		required: true,
		default: 0,
	},
});

const Detection = mongoose.model('Detection', DetectionSchema);

module.exports = Detection;
