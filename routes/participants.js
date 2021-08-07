const {promiseImpl} = require('ejs');
const express = require('express');
// const {createTinyFaceDetector, awaitMediaLoaded} = require('face-api.js');
const router = express.Router();
const Participant = require('../models/Participant');
const User = require('../models/User');

// FUNCTION: 'update_participant' |
// async function find_participant_in_list(user_obj, participant_id) {
// 	try{
// 		for(let i =0; i< user_obj.participants.length ; i++){
// 			const await = User.
// 		}
// 	}
// }

// FUNCTION: 'get_all_participants' | returns array of all participants belong to a specific user
async function get_all_participants(user_id) {
	let data = [];
	try {
		const user = await User.findById(user_id);
		if (user) {
			for (var i = 0; i < user.participants.length; i++) {
				let obj = await Participant.findById(user.participants[i]);
				data.push({first_name: obj.first_name, last_name: obj.last_name, id: obj.id, obj_id: obj._id});
			}
		}
	} catch (err) {
		console.log(err.message);
	}
	return data;
}

// FUNCTION: 'delete_participant' | remove specific user from user's list
async function delete_participant(user_id, participants_id) {
	try {
		Participant.findByIdAndDelete(participants_id, function (err, docs) {
			if (err) {
			} else {
				console.log('deleted: ', docs);
			}
		});
		const user = await User.findById(user_id);
		for (let i = 0; i < user.participants.length; i++) {
			// console.log(user.participants[i], participants_id);
			if (user.participants[i] == participants_id) {
				user.participants.splice(i, 1);
				i--;
				console.log('found');
			}
		}
		return user.save();
	} catch (err) {
		console.log(err.message);
	}
}

// update participant in participants list | POST /participants/update
router.post('/update', (req, res) => {
	const {first_name, last_name, id} = req.body;
	Participant.findOneAndUpdate({id: id}, {first_name: first_name, last_name: last_name}, {new: true}, function (err, doc) {
		if (err) {
			console.log(err);
			req.flash('error_msg', 'Participant cannot be updated');
			res.redirect('/dashboard/participants');
		} else {
			console.log('updated: ', doc);
			req.flash('success_msg', 'Participant updated');
			res.redirect('/dashboard/participants');
		}
	});
});

// add participant to user's participants list | POST /participants/add
router.post('/add', (req, res) => {
	const {first_name, last_name, id} = req.body;
	const user = req.user;
	console.log(id);
	User.findOne({_id: user.id}) //first, find current user
		.then((user) => {
			if (user) {
				//then, search for the participant we want to add in db
				Participant.findOne({id: id})
					.then((participant) => {
						//if participant already exits
						//search him in user's participant list, if exists in list do nothing, if don't - add to list
						if (participant) {
							let found = false;
							user.participants.forEach((elem) => {
								if (String(elem) == String(participant._id)) {
									found = true;
									req.flash('error_msg', 'Participant already in your list');
									res.redirect('/dashboard/participants');
								}
							});
							if (!found) {
								user.participants.push(participant);
								user
									.save()
									.then((participant) => {
										req.flash('success_msg', 'Participant added to your list');
										res.redirect('/dashboard/participants');
										
									})
									.catch((err) => {
										console.log(err.message);
									});
							}
						} else {
							//else, create participant and add it to user's participants list
							const newParticipant = new Participant({
								first_name,
								last_name,
								id,
							});
							newParticipant
								.save()
								.then((participant) => {
									req.flash('success_msg', 'Participant added to your list');
									res.redirect('/dashboard/participants');
								})
								.catch((err) => console.log(err));

							user.participants.push(newParticipant);
							user.save().catch((err) => {
								console.log(err.message);
							});
						}
					})
					.catch((err) => {
						console.log(err.message);
					});
			}
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// show participants list | GET /participants/list
router.get('/list', (req, res) => {
	res.render('participants');
});

// remove participant from user's participant list | DELETE /participants/:id
router.delete('/:id', (req, res) => {
	let promise = delete_participant(req.user, req.params.id);
	promise
		.then((p) => {
			req.flash('success_msg', 'Participant successfully removed from your list');
			res.redirect('/dashboard/participants');
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// participants page | GET /participants
router.get('/', (req, res) => {
	if (req.user.participants.length > 0) {
		//if user has participants in his list
		get_all_participants(req.user.id).then((data) => {
			res.render('participants', {user: req.user, participants: data});
		});
	} else {
		res.render('participants', {user: req.user});
	}
});

module.exports = router;
