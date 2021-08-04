const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const User = require('../models/User');
const Session = require('../models/Session');

// FUNCTION: 'create_session' | create new session
async function create_session(user_id, detected_names) {
	try {
		const user = await User.findById(user_id);
		if (user) {
			const new_session = new Session({user: user});
			for (let i = 0; i < detected_names.length; i++) {
				let elem = detected_names[i].split(' ');
				// console.log(elem[0], elem[1]);
				let participant = await Participant.findOne({first_name: elem[0], last_name: elem[1]});
				// console.log(participant);
				if (participant) {
					new_session.participants.push(participant);
				}
			}
			return new_session.save();
		}
	} catch (err) {
		console.log(err.message);
	}
}

// FUNCTION: 'detected_names_reduction' |  detected names array duplicates reduction
function detected_names_reduction(detected_names) {
	let new_array = [];
	detected_names.forEach((name) => {
		if (!new_array.includes(name)) {
			new_array.push(name);
		}
	});
	return new_array;
}

// create new session in DB | POST /session/create
router.post('/create', (req, res) => {
	const detected_names = detected_names_reduction(req.body);
	let new_session = create_session(req.session.passport.user, detected_names);
	new_session
		.then((p) => {
			// req.flash('success_msg', 'Session created successfully');
			console.log('then!');
			res.redirect('/dashboard'); //todo: redirection problem
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// start new session | GET /session/
router.get('/', (req, res) => {
	res.render('session');
});

module.exports = router;
