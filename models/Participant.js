const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Participant = mongoose.model('Participant', ParticipantSchema);

module.exports = Participant;
