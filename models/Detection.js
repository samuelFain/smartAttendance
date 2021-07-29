const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
	detected: {
		type: Number,
		required: true,
		default: 0,
	},
});

const Detection = mongoose.model('Detection', DetectionSchema);

module.exports = Detection;
