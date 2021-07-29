const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
    user : {
        type:mongoose.Schema.Types.ObjectID,
		ref: 'Participant',
        required: true
    },
    participants: [{
		type:mongoose.Schema.Types.ObjectID,
		ref: 'Participant',
		required: false
	}],
    
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
