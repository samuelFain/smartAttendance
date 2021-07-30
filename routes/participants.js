const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');

router.post('/add', (req, res) => {
	const {first_name, last_name, id} = req.body;
	let errors = [];

	// Check required fields
	if (!first_name || !last_name || !id) {
		errors.push({msg: 'Please fill in all fields'});
	}

	if (errors.length > 0) {
		res
			.render('participants', {
				errors,
				first_name,
				last_name,
				id,
			})
			.then(() => {
				console.log('hi');
				document.getElementById('add-participant-btn').click();
			});
	}
});

// show participants list | GET /participants/list
router.get('/list', (req, res) => {
	res.render('participants');
});

// participants page | GET /participants
router.get('/', (req, res) => {
	res.render('participants');
});

module.exports = router;
