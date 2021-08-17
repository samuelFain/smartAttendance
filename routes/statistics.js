const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const User = require('../models/User');
const Session = require('../models/Session');

function sessions_attended(sessions, participant_id) {
	let cnt = 0;
	sessions.forEach((sessions) => {
		if (sessions.participants.includes(participant_id)) {
			cnt++;
		}
	});
	return cnt;
}

async function get_participants_statistics(user) {
	let stats = [];
	try {
		const sessions = await Session.find({user: user._id});
		if (sessions.length > 0) {
			for (let i = 0; i < user.participants.length; i++) {
				let attended = sessions_attended(sessions, user.participants[i]);
				let percent = Math.floor((attended / sessions.length) * 100) + '%';
				attended = attended + ' / ' + sessions.length;
				const p = await Participant.findById(user.participants[i]);
				stats.push({first_name: p.first_name, last_name: p.last_name, id: p.id, attended: attended, score: percent});
			}
		}
		return stats;
	} catch (err) {
		console.log(err.message);
	}
}

// statistics page | GET /statistics
router.get('/', (req, res) => {
	let promise = get_participants_statistics(req.user).then((stats) => {
		res.render('statistics', {user: req.user, stats: stats});
	});
});

module.exports = router;
